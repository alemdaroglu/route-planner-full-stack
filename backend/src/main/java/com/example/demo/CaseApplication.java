package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
@EnableCaching
@ComponentScan(basePackages = "com.example")
public class CaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(CaseApplication.class, args);
	}

}
