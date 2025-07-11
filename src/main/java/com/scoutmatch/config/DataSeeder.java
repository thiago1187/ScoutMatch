// src/main/java/com/scoutmatch/config/DataSeeder.java
package com.scoutmatch.config;

import com.scoutmatch.model.Jogador;
import com.scoutmatch.repository.JogadorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final JogadorRepository repo;

    public DataSeeder(JogadorRepository repo) { this.repo = repo; }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return; // já tem dados

        repo.save(new Jogador(null,"Carlos Silva","Zagueiro","Direita",
                              "Cabeceio","Defensivo",32));
        repo.save(new Jogador(null,"Lucas Lima","Meio-Campo","Esquerda",
                              "Passe","Equilibrado",25));
        repo.save(new Jogador(null,"João Souza","Atacante","Direita",
                              "Finalização","Ofensivo",23));
        repo.save(new Jogador(null,"Pedro Alves","Lateral","Ambidestro",
                              "Velocidade","Ofensivo",28));
        repo.save(new Jogador(null,"Rafael Costa","Goleiro","Esquerda",
                              "Desarme","Defensivo",30));
        repo.save(new Jogador(null,"André Gomes","Meio-Campo","Direita",
                              "Drible","Equilibrado",21));
    }
}