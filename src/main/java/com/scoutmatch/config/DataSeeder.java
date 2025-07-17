package com.scoutmatch.config;

import com.scoutmatch.model.Jogador;
import com.scoutmatch.model.Time;
import com.scoutmatch.repository.JogadorRepository;
import com.scoutmatch.repository.TimeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final JogadorRepository jogadorRepo;
    private final TimeRepository timeRepo;

    public DataSeeder(JogadorRepository jogadorRepo, TimeRepository timeRepo) {
        this.jogadorRepo = jogadorRepo;
        this.timeRepo = timeRepo;
    }

    @Override
    public void run(String... args) {
        if (jogadorRepo.count() == 0) {
            jogadorRepo.save(new Jogador(null, "Carlos Silva", "Zagueiro", "Direita",
                    "Cabeceio", "Defensivo", "Brasil", "1.85m", "80kg", 32));
            jogadorRepo.save(new Jogador(null, "Lucas Lima", "Meio-Campo", "Esquerda",
                    "Passe", "Equilibrado", "Brasil", "1.78m", "75kg", 25));
            jogadorRepo.save(new Jogador(null, "João Souza", "Atacante", "Direita",
                    "Finalização", "Ofensivo", "Brasil", "1.80m", "77kg", 23));
            jogadorRepo.save(new Jogador(null, "Pedro Alves", "Lateral", "Ambidestro",
                    "Velocidade", "Ofensivo", "Brasil", "1.75m", "72kg", 28));
            jogadorRepo.save(new Jogador(null, "Rafael Costa", "Goleiro", "Esquerda",
                    "Desarme", "Defensivo", "Brasil", "1.88m", "85kg", 30));
            jogadorRepo.save(new Jogador(null, "André Gomes", "Meio-Campo", "Direita",
                    "Drible", "Equilibrado", "Brasil", "1.76m", "70kg", 21));
        }

        if (timeRepo.count() == 0) {
            // Ordem correta: id, nome, posicaoDesejada, pernaDesejada, skillDesejada, estiloProcurado, fundacao, minIdade, maxIdade
            timeRepo.save(new Time(null, "Sport", "Atacante", "Direita", "Finalização", "Ofensivo", "1905", 20, 30));
            timeRepo.save(new Time(null, "Mirassol", "Meio-Campo", "Esquerda", "Passe", "Equilibrado", "1925", 18, 28));
            timeRepo.save(new Time(null, "Flamengo", "Zagueiro", "Ambidestro", "Cabeceio", "Defensivo", "1895", 24, 32));
            timeRepo.save(new Time(null, "Palmeiras", "Lateral", "Direita", "Velocidade", "Ofensivo", "1914", 21, 29));
        }
    }
}