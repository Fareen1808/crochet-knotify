package com.crochet.crochetstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CrochetstoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrochetstoreApplication.class, args);
    }
}
