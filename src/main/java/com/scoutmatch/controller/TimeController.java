package com.scoutmatch.controller;

import com.scoutmatch.model.Time;
import com.scoutmatch.service.TimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.scoutmatch.dto.JogadorMatchDTO;
import java.util.List;

@RestController
@RequestMapping("/times")
public class TimeController {

    private final TimeService timeService;

    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    @PostMapping
    public ResponseEntity<Time> criar(@RequestBody Time time) {
        return ResponseEntity.ok(timeService.salvar(time));
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