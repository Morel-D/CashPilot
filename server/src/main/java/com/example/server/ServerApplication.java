package com.example.server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.RedisTemplate;


@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	CommandLineRunner testRedis(RedisTemplate<String, Object> redisTemplate) {
		return arg -> {
			try {
				redisTemplate.opsForValue().set("test:key", "Hello from CashPilot");
				String value = (String) redisTemplate.opsForValue().get("test:key");
				System.out.println("✅ Redis Connected Successfully! Value: "+ value);
			}catch (Exception e){
				System.err.println("❌ Redis Connection Failed: "+ e.getMessage());
			}
		};
	}

}
