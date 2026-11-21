package com.example.device_maintenance_backend.controller;

import com.example.device_maintenance_backend.api.ApiPaths;
import com.example.device_maintenance_backend.response.SuccessResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.V1)
public class HelloController {

	@GetMapping("/hello")
	public SuccessResponse<String> hello() {
		return SuccessResponse.of(HttpStatus.OK, "Success", "hello diep lien tu");
	}
}
