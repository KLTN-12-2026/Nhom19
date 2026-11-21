package com.example.device_maintenance_backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HelloController.class)
@AutoConfigureMockMvc(addFilters = false)
class HelloControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void helloReturnsMessage() throws Exception {
		mockMvc.perform(get("/api/v1/hello"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value(200))
				.andExpect(jsonPath("$.data").value("hello diep lien tu"))
				.andExpect(jsonPath("$.total").doesNotExist());
	}
}
