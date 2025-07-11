package com.scoutmatch.service;

import com.scoutmatch.model.Jogador;
import com.scoutmatch.repository.JogadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JogadorService {

    private final JogadorRepository jogadorRepository;

    public JogadorService(JogadorRepository jogadorRepository) {
        this.jogadorRepository = jogadorRepository;
    }

    public Jogador salvar(Jogador jogador) {
        return jogadorRepository.save(jogador);
    }

    public List<Jogador> listarTodos() {
        return jogadorRepository.findAll();
    }

    public Optional<Jogador> buscarPorId(Long id) {
        return jogadorRepository.findById(id);
    }

    public Optional<Jogador> atualizar(Long id, Jogador jogador) {
        return jogadorRepository.findById(id)
            .map(existing -> {
                existing.setNome(jogador.getNome());
                existing.setPosicao(jogador.getPosicao());
                existing.setPernaBoa(jogador.getPernaBoa());
                existing.setMelhorSkill(jogador.getMelhorSkill());
                existing.setEstiloDeJogo(jogador.getEstiloDeJogo());
                existing.setIdade(jogador.getIdade());
                return jogadorRepository.save(existing);
            });
    }


    public void deletar(Long id) {
        jogadorRepository.deleteById(id);
    }
}