package com.scoutmatch.service;

import com.scoutmatch.dto.JogadorMatchDTO;
import com.scoutmatch.model.Jogador;
import com.scoutmatch.model.Time;
import com.scoutmatch.repository.JogadorRepository;
import com.scoutmatch.repository.TimeRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimeService {

    private final TimeRepository timeRepository;
    private final JogadorRepository jogadorRepository;

    public TimeService(TimeRepository timeRepository, JogadorRepository jogadorRepository) {
        this.timeRepository = timeRepository;
        this.jogadorRepository = jogadorRepository;
    }

    public Time salvar(Time time) {
        if (time.getMinIdade() > time.getMaxIdade()) {
            throw new IllegalArgumentException("minIdade cannot be greater than maxIdade");
        }
        return timeRepository.save(time);
    }

    public List<Time> listarTodos() {
        return timeRepository.findAll();
    }

    public Optional<Time> buscarPorId(Long id) {
        return timeRepository.findById(id);
    }

    
    public Optional<Time> atualizar(Long id, Time time) {
        return timeRepository.findById(id)
            .map(existing -> {
                if (time.getMinIdade() > time.getMaxIdade()) {
                    throw new IllegalArgumentException("minIdade cannot be greater than maxIdade");
                }
                existing.setNome(time.getNome());
                existing.setPosicaoDesejada(time.getPosicaoDesejada());
                existing.setPernaDesejada(time.getPernaDesejada());
                existing.setSkillDesejada(time.getSkillDesejada());
                existing.setEstiloProcurado(time.getEstiloProcurado());
                existing.setMinIdade(time.getMinIdade());
                existing.setMaxIdade(time.getMaxIdade());
                return timeRepository.save(existing);
            });
    }

    public void deletar(Long id) {
        timeRepository.deleteById(id);
    }

    public List<JogadorMatchDTO> getMatches(Long timeId) {
        Optional<Time> optionalTime = timeRepository.findById(timeId);
        if (optionalTime.isEmpty()) return Collections.emptyList();

        Time time = optionalTime.get();
        List<Jogador> jogadores = jogadorRepository.findAll();

        List<JogadorMatchDTO> matches = new ArrayList<>();

        for (Jogador jogador : jogadores) {
            int score = 0;
            List<String> criterios = new ArrayList<>();

            if (jogador.getPosicao().equalsIgnoreCase(time.getPosicaoDesejada())) {
                score++;
                criterios.add("posição");
            }
            if (jogador.getPernaBoa().equalsIgnoreCase(time.getPernaDesejada())) {
                score++;
                criterios.add("perna");
            }
            if (jogador.getMelhorSkill().equalsIgnoreCase(time.getSkillDesejada())) {
                score++;
                criterios.add("skill");
            }
            if (jogador.getEstiloDeJogo().equalsIgnoreCase(time.getEstiloProcurado())) {
                score++;
                criterios.add("estilo");
            }
            if (jogador.getIdade() >= time.getMinIdade() && jogador.getIdade() <= time.getMaxIdade()) {
                score++;
                criterios.add("idade");
            }

            if (score > 0) {
                String frase = score == 5 ?
                        "Muito compatível: " + String.join(", ", criterios) + " combinam com o time" :
                        "Compatível: " + String.join(", ", criterios) + " combinam com o time";

                        matches.add(new JogadorMatchDTO(jogador.getId(), jogador.getNome(), score, frase));
            }
        }

        return matches.stream()
                .sorted(Comparator.comparingInt(JogadorMatchDTO::getCompatibilidade).reversed())
                .collect(Collectors.toList());
    }
}