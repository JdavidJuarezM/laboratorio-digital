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

        Map<Integer, List<Map<String, Object>>> estructura = new HashMap<>();

        for (Pregunta p : lista) {
            estructura.putIfAbsent(p.getEtapa(), new ArrayList<>());
            Map<String, Object> dto = new HashMap<>();
            dto.put("pregunta", p.getPregunta());
            dto.put("opciones", p.getOpciones());
            dto.put("correcta", p.getCorrecta());
            // --- CAMBIO: Enviamos el estado habilitada ---
            dto.put("habilitada", p.getHabilitada());
            estructura.get(p.getEtapa()).add(dto);
        }
        return estructura;
    }

    @Transactional
    public void guardarTodo(Map<String, List<PreguntaDTO>> payload) {
        Maestro maestro = maestroService.getCurrentMaestro();
        preguntaRepository.deleteByMaestro(maestro);

        List<Pregunta> nuevas = new ArrayList<>();

        payload.forEach((key, listaPreguntas) -> {
            Integer etapa = Integer.parseInt(key);
            for (PreguntaDTO dto : listaPreguntas) {
                Pregunta p = new Pregunta();
                p.setEtapa(etapa);
                p.setPregunta(dto.getPregunta());
                p.setOpciones(dto.getOpciones());
                p.setCorrecta(dto.getCorrecta());
                // --- CAMBIO: Guardamos el estado (default true) ---
                p.setHabilitada(dto.getHabilitada() != null ? dto.getHabilitada() : true);
                p.setMaestro(maestro);
                nuevas.add(p);
            }
        });

        preguntaRepository.saveAll(nuevas);
    }

    // DTO actualizado
    public static class PreguntaDTO {
        private String pregunta;
        private List<String> opciones;
        private String correcta;
        private Boolean habilitada; // --- CAMBIO ---

        public String getPregunta() { return pregunta; }
        public void setPregunta(String p) { this.pregunta = p; }
        public List<String> getOpciones() { return opciones; }
        public void setOpciones(List<String> o) { this.opciones = o; }
        public String getCorrecta() { return correcta; }
        public void setCorrecta(String c) { this.correcta = c; }
        public Boolean getHabilitada() { return habilitada; }
        public void setHabilitada(Boolean h) { this.habilitada = h; }
    }
}