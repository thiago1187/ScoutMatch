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
public class Jogador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String nome;

    @NotBlank
    private String posicao;

    @NotBlank
    private String pernaBoa;

    @NotBlank
    private String melhorSkill;

    @NotBlank
    private String estiloDeJogo;

    @NotBlank
    private String nacionalidade;

    @NotBlank
    private String altura;

    @NotBlank
    private String peso;

    @Min(15)
    @Max(50)
    private int idade;
}
