package com.scoutmatch;

import com.scoutmatch.controller.GlobalExceptionHandler;
import com.scoutmatch.controller.TimeController;
import com.scoutmatch.service.TimeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TimeController.class)
@Import(GlobalExceptionHandler.class)
class TimeControllerAdviceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TimeService timeService;

    @Test
    void postReturnsBadRequestWhenServiceThrowsIllegalArgument() throws Exception {
        when(timeService.salvar(any())).thenThrow(new IllegalArgumentException("invalid"));

        String json = "{" +
                "\"nome\":\"FC Recife\"," +
                "\"posicaoDesejada\":\"Zagueiro\"," +
                "\"pernaDesejada\":\"Direita\"," +
                "\"skillDesejada\":\"Cabeceio\"," +
                "\"estiloProcurado\":\"Defensivo\"," +
                "\"minIdade\":30," +
                "\"maxIdade\":40" +
                "}";

        mockMvc.perform(post("/times")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }
}
