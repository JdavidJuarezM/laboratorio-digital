package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.Pregunta;
import com.laboratoriodigital.backend.repositories.PreguntaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PreguntaService {

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Autowired
    private MaestroService maestroService;

    @Transactional(readOnly = true)
    public Map<Integer, List<Map<String, Object>>> obtenerPreguntasEstructuradas() {
        Maestro maestro = maestroService.getCurrentMaestro();
        List<Pregunta> lista = preguntaRepository.findByMaestro(maestro);

        // Convertimos la lista plana a la estructura { 0: [...], 1: [...] } que usa el frontend
        Map<Integer, List<Map<String, Object>>> estructura = new HashMap<>();

        for (Pregunta p : lista) {
            estructura.putIfAbsent(p.getEtapa(), new ArrayList<>());
            Map<String, Object> dto = new HashMap<>();
            dto.put("pregunta", p.getPregunta());
            dto.put("opciones", p.getOpciones());
            dto.put("correcta", p.getCorrecta());
            estructura.get(p.getEtapa()).add(dto);
        }
        return estructura;
    }

    @Transactional
    public void guardarTodo(Map<String, List<PreguntaDTO>> payload) {
        Maestro maestro = maestroService.getCurrentMaestro();

        // 1. Limpiamos las preguntas anteriores de este maestro para sobrescribir
        preguntaRepository.deleteByMaestro(maestro);

        // 2. Guardamos las nuevas
        List<Pregunta> nuevas = new ArrayList<>();

        payload.forEach((key, listaPreguntas) -> {
            Integer etapa = Integer.parseInt(key);
            for (PreguntaDTO dto : listaPreguntas) {
                Pregunta p = new Pregunta();
                p.setEtapa(etapa);
                p.setPregunta(dto.getPregunta());
                p.setOpciones(dto.getOpciones());
                p.setCorrecta(dto.getCorrecta());
                p.setMaestro(maestro);
                nuevas.add(p);
            }
        });

        preguntaRepository.saveAll(nuevas);
    }

    // DTO interno para recibir datos
    public static class PreguntaDTO {
        private String pregunta;
        private List<String> opciones;
        private String correcta;

        public String getPregunta() { return pregunta; }
        public void setPregunta(String p) { this.pregunta = p; }
        public List<String> getOpciones() { return opciones; }
        public void setOpciones(List<String> o) { this.opciones = o; }
        public String getCorrecta() { return correcta; }
        public void setCorrecta(String c) { this.correcta = c; }
    }
}