package com.scoutmatch.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    @Min(15)
    @Max(50)
    private int minIdade;
    @Min(15)
    @Max(50)
    private int maxIdade;
}
