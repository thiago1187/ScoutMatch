package com.scoutmatch.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Jogador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String posicao;
    private String pernaBoa;
    private String melhorSkill;
    private String estiloDeJogo;
    private int idade;
}
