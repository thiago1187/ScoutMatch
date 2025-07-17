package com.scoutmatch.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Time {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    @NotBlank
    private String posicaoDesejada;

    @NotBlank
    private String pernaDesejada;

    @NotBlank
    private String skillDesejada;

    @NotBlank
    private String estiloProcurado;
    
    @NotBlank
    private String fundacao;
    
    @Min(15)
    @Max(50)
    private int minIdade;
    
    @Min(15)
    @Max(50)
    private int maxIdade;
}
