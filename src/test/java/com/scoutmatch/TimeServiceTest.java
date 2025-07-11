package com.scoutmatch;

import com.scoutmatch.model.Time;
import com.scoutmatch.repository.JogadorRepository;
import com.scoutmatch.repository.TimeRepository;
import com.scoutmatch.service.TimeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TimeServiceTest {

    @Mock
    private TimeRepository timeRepository;
    @Mock
    private JogadorRepository jogadorRepository;
    @InjectMocks
    private TimeService timeService;

    @Test
    void atualizarThrowsWhenMinGreaterThanMax() {
        Time existing = new Time(1L, "A", "B", "C", "D", "E", 20, 30);
        when(timeRepository.findById(1L)).thenReturn(Optional.of(existing));

        Time update = new Time();
        update.setMinIdade(35);
        update.setMaxIdade(25);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> timeService.atualizar(1L, update));
        assertEquals("minIdade cannot be greater than maxIdade", ex.getMessage());
        verify(timeRepository, never()).save(any());
    }
}