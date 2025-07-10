package com.scoutmatch.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Time {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String posicaoDesejada;
    private String pernaDesejada;
    private String skillDesejada;
    private String estiloProcurado;
    private int minIdade;
    private int maxIdade;
}
