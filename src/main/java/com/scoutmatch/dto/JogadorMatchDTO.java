package com.scoutmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JogadorMatchDTO {
    private String nome;
    private int compatibilidade;
    private String resumo;
}