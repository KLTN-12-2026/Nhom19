package com.example.device_maintenance_backend.controller;

import com.example.device_maintenance_backend.dto.request.UserRequestDTO;
import com.example.device_maintenance_backend.dto.response.UserResponseDTO;
import com.example.device_maintenance_backend.entity.Role;
import com.example.device_maintenance_backend.entity.User;
import com.example.device_maintenance_backend.repository.UserRepository;
import com.example.device_maintenance_backend.security.AccessTokenService;
import com.example.device_maintenance_backend.security.DatabaseUserDetailsService;
import com.example.device_maintenance_backend.security.JwtSigningConfig;
import com.example.device_maintenance_backend.security.SecurityConfig;
import com.example.device_maintenance_backend.service.UserService;
import com.jayway.jsonpath.JsonPath;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.json.JsonMapper;

import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AuthController.class, AdminUserController.class}, properties = {
        "app.jwt.secret-base64=" + AuthControllerTest.TEST_KEY,
        "app.jwt.access-token-ttl-minutes=30"
})
@Import({SecurityConfig.class, DatabaseUserDetailsService.class, AccessTokenService.class, JwtSigningConfig.class})
@ImportAutoConfiguration({ServletWebSecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class})
class AuthControllerTest {
    static final String TEST_KEY = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=";
    private static final String LOGIN_PATH = "/api/v1/auth/login";
    private static final String ADMIN_USERS_PATH = "/api/v1/admin/users";
    private static final String USERNAME = "demo";
    private static final String EMAIL = "demo@example.com";
    private static final String PASSWORD = "DemoLogin2026!";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccessTokenService accessTokenService;

    @Autowired
    private JwtEncoder jwtEncoder;

    @MockitoBean
    private UserRepository users;

    @MockitoBean
    private UserService userService;

    @Test
    void adminTokenAllowsUserCreation() throws Exception {
        when(userService.createUser(any())).thenReturn(profile(1L));

        createUser(accessTokenService.issue(profile(2L)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.roleId").value(1));
    }

    @Test
    void userTokenCannotCreateAccounts() throws Exception {
        expectError(createUser(accessTokenService.issue(profile(1L))), 403, "Forbidden", ADMIN_USERS_PATH);
        verifyNoInteractions(userService);
    }

    @Test
    void missingTokenReturnsBearerChallenge() throws Exception {
        expectError(createUser(null), 401, "Valid access token required", ADMIN_USERS_PATH)
                .andExpect(header().string(HttpHeaders.WWW_AUTHENTICATE, startsWith("Bearer")));
        verifyNoInteractions(userService);
    }

    @Test
    void tokenWithModifiedSignatureIsRejected() throws Exception {
        String token = accessTokenService.issue(profile(2L));
        int signatureStart = token.lastIndexOf('.') + 1;
        char changed = token.charAt(signatureStart) == 'A' ? 'B' : 'A';
        String modifiedToken = token.substring(0, signatureStart) + changed + token.substring(signatureStart + 1);

        expectError(createUser(modifiedToken), 401, "Valid access token required", ADMIN_USERS_PATH);
        verifyNoInteractions(userService);
    }

    @Test
    void expiredAdminTokenIsRejected() throws Exception {
        Instant now = Instant.now();
        var claims = JwtClaimsSet.builder().subject("7").claim("roleId", 2L)
                .issuedAt(now.minusSeconds(1801)).expiresAt(now.minusSeconds(1)).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
                .getTokenValue();

        expectError(createUser(token), 401, "Valid access token required", ADMIN_USERS_PATH);
        verifyNoInteractions(userService);
    }

    private ResultActions createUser(String token) throws Exception {
        var request = post(ADMIN_USERS_PATH).contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"userName":"newuser","password":"DemoLogin2026!","email":"newuser@example.com"}
                        """);
        if (token != null) {
            request.header(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        }
        return mockMvc.perform(request);
    }

    private static UserResponseDTO profile(long roleId) {
        return new UserResponseDTO(7L, USERNAME, EMAIL, "0900000000", "Demo User", roleId);
    }

    @ParameterizedTest
    @ValueSource(strings = {"  demo  ", EMAIL})
    void loginReturnsProfileAndSignedAccessToken(String identifier) throws Exception {
        User user = account(PASSWORD);
        if (identifier.equals(EMAIL)) {
            when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        } else {
            when(users.findByUserName(USERNAME)).thenReturn(Optional.of(user));
        }

        String response = login(identifier, PASSWORD)
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.userId").value(7))
                .andExpect(jsonPath("$.data.userName").value(USERNAME))
                .andExpect(jsonPath("$.data.email").value(EMAIL))
                .andExpect(jsonPath("$.data.phone").value("0900000000"))
                .andExpect(jsonPath("$.data.fullName").value("Demo User"))
                .andExpect(jsonPath("$.data.roleId").value(2))
                .andExpect(jsonPath("$.data.password").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.total").doesNotHaveJsonPath())
                .andReturn().getResponse().getContentAsString();

        String tokenValue = JsonPath.read(response, "$.data.accessToken");
        SignedJWT token = SignedJWT.parse(tokenValue);
        assertThat(token.getHeader().getAlgorithm()).isEqualTo(JWSAlgorithm.HS256);
        assertThat(token.getHeader().getType().getType()).isEqualTo("JWT");
        assertThat(token.verify(new MACVerifier(Base64.getDecoder().decode(TEST_KEY)))).isTrue();

        var claims = token.getJWTClaimsSet();
        assertThat(claims.getSubject()).isEqualTo("7");
        assertThat(claims.getStringClaim("userName")).isEqualTo(USERNAME);
        assertThat(claims.getStringClaim("email")).isEqualTo(EMAIL);
        assertThat(claims.getLongClaim("roleId")).isEqualTo(2L);
        assertThat(claims.getClaim("password")).isNull();
        assertThat(claims.getExpirationTime().getTime() - claims.getIssueTime().getTime())
                .isEqualTo(1_800_000L);
    }

    @Test
    void acceptsPasswordAtExactly72Utf8Bytes() throws Exception {
        String password = "\u00e9".repeat(36);
        User user = account(password);
        when(users.findByUserName(USERNAME)).thenReturn(Optional.of(user));

        login(USERNAME, password)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isString());
    }

    @Test
    void wrongPasswordReturnsUnauthorized() throws Exception {
        User user = account(PASSWORD);
        when(users.findByUserName(USERNAME)).thenReturn(Optional.of(user));

        expectError(login(USERNAME, "wrong-password"), 401, "Invalid identifier or password", LOGIN_PATH);
    }

    @ParameterizedTest
    @ValueSource(strings = {"unknown", "unknown@example.com"})
    void unknownAccountReturnsSameUnauthorizedError(String identifier) throws Exception {
        expectError(login(identifier, PASSWORD), 401, "Invalid identifier or password", LOGIN_PATH);
    }

    @ParameterizedTest
    @MethodSource("invalidRequests")
    void validationRejectsInvalidFieldsBeforeLookingUpUser(String identifier, String password, String message)
            throws Exception {
        expectError(login(identifier, password), 400, message, LOGIN_PATH);
        verifyNoInteractions(users);
    }

    private static Stream<Arguments> invalidRequests() {
        return Stream.of(
                Arguments.of(null, PASSWORD, "Identifier is required"),
                Arguments.of("   ", PASSWORD, "Identifier is required"),
                Arguments.of("x".repeat(255), PASSWORD, "Identifier must be at most 254 characters"),
                Arguments.of(USERNAME, null, "Password is required"),
                Arguments.of(USERNAME, "", "Password is required"),
                Arguments.of(USERNAME, "x".repeat(73), "Password must be at most 72 bytes in UTF-8"),
                Arguments.of(USERNAME, "\u00e9".repeat(37), "Password must be at most 72 bytes in UTF-8")
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "{\"identifier\":"})
    void missingOrMalformedJsonReturnsBadRequest(String body) throws Exception {
        var request = mockMvc.perform(post(LOGIN_PATH).contentType(MediaType.APPLICATION_JSON).content(body));
        expectError(request, 400, "Invalid request", LOGIN_PATH);
        verifyNoInteractions(users);
    }

    @Test
    void unsupportedContentTypeReturns415() throws Exception {
        var request = mockMvc.perform(post(LOGIN_PATH).contentType(MediaType.TEXT_PLAIN).content("demo"));
        expectError(request, 415, "Unsupported media type", LOGIN_PATH);
        verifyNoInteractions(users);
    }

    @Test
    void getOnLoginPathIsForbidden() throws Exception {
        expectError(mockMvc.perform(get(LOGIN_PATH)), 403, "Forbidden", LOGIN_PATH);
        verifyNoInteractions(users);
    }

    @Test
    void loginWithoutApiPrefixIsForbidden() throws Exception {
        String path = "/auth/login";
        var request = mockMvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content("{}"));
        expectError(request, 403, "Forbidden", path);
        verifyNoInteractions(users);
    }

    @Test
    void repositoryFailureReturnsGenericServerError() throws Exception {
        when(users.findByUserName(USERNAME))
                .thenThrow(new DataAccessResourceFailureException("Sensitive database diagnostic"));

        var result = expectError(login(USERNAME, PASSWORD), 500, "Internal Server Error", LOGIN_PATH);
        assertThat(result.andReturn().getResponse().getContentAsString())
                .doesNotContain("Sensitive database diagnostic");
    }

    private ResultActions login(String identifier, String password) throws Exception {
        String body = jsonMapper.writeValueAsString(new UserRequestDTO(identifier, password));
        return mockMvc.perform(post(LOGIN_PATH).contentType(MediaType.APPLICATION_JSON).content(body));
    }

    private ResultActions expectError(ResultActions result, int code, String message, String path) throws Exception {
        return result.andExpect(status().is(code))
                .andExpect(jsonPath("$.status").value(code))
                .andExpect(jsonPath("$.message").value(message))
                .andExpect(jsonPath("$.path").value(path))
                .andExpect(jsonPath("$.timestamp").isString())
                .andExpect(jsonPath("$.data").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.accessToken").doesNotHaveJsonPath());
    }

    private User account(String password) {
        Role role = mock(Role.class);
        when(role.getRoleId()).thenReturn(2L);

        User user = mock(User.class);
        when(user.getUserId()).thenReturn(7L);
        when(user.getUserName()).thenReturn(USERNAME);
        when(user.getEmail()).thenReturn(EMAIL);
        when(user.getPhone()).thenReturn("0900000000");
        when(user.getFullName()).thenReturn("Demo User");
        when(user.getRole()).thenReturn(role);
        when(user.getPassword()).thenReturn(passwordEncoder.encode(password));
        return user;
    }
}
