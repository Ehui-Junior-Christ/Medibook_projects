package com.medibook.medibook_springboot.common;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration pour servir les fichiers statiques du frontend
 * et definir index.html comme page d'accueil.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve frontend files from the ../frontend directory relative to the Spring Boot project
        registry.addResourceHandler("/**")
                .addResourceLocations(
                        "file:../frontend/",
                        "classpath:/static/"
                )
                .setCachePeriod(0);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // When visiting /, redirect to index.html
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
