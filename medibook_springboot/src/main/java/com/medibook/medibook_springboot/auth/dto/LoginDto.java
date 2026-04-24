package com.medibook.medibook_springboot.auth.dto;

import lombok.Data;

@Data
public class LoginDto {

    private String identifiant;
    private String motDePasse;
    private String role;
}
