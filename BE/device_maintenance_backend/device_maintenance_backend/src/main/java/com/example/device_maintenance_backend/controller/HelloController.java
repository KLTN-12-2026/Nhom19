package com.example.device_maintenance_backend.controller;

import com.example.device_maintenance_backend.api.ApiPaths;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.V1)
public class HelloController {

	@GetMapping("/hello")
	public String hello() {
		System.out.println("hello diep lien tu");
		return "hello diep lien tu";
	}
}
