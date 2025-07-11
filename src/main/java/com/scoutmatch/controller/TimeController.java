package com.scoutmatch.controller;

import com.scoutmatch.model.Time;
import com.scoutmatch.service.TimeService;
import com.scoutmatch.dto.JogadorMatchDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/times")
public class TimeController {

    private final TimeService timeService;

    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    @PostMapping
    public ResponseEntity<Time> criar(@RequestBody @Valid Time time) {
        return ResponseEntity.ok(timeService.salvar(time));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Time> editar(@PathVariable Long id, @RequestBody @Valid Time novoTime) {
        return timeService.buscarPorId(id)
            .map(timeExistente -> {
                novoTime.setId(id); // garante que o ID do body será o mesmo do path
                return ResponseEntity.ok(timeService.salvar(novoTime));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Time>> listarTodos() {
        return ResponseEntity.ok(timeService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Time> buscarPorId(@PathVariable Long id) {
        return timeService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<List<JogadorMatchDTO>> buscarMatches(@PathVariable Long id) {
        return ResponseEntity.ok(timeService.getMatches(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        timeService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}