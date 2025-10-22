package com.laboratoriodigital.backend.services;


import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.ProgresoHuerto;
import com.laboratoriodigital.backend.repositories.MaestroRepository;
import com.laboratoriodigital.backend.repositories.ProgresoHuertoRepository;
import org.springframework.transaction.annotation.Transactional ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HuertoService {

    @Autowired
    private ProgresoHuertoRepository progresoHuertoRepository;


    @Autowired
    private MaestroRepository maestroRepository;



    public Maestro findMaestroByEmail(String email) {
        return maestroRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con email: " + email));
    }



    @Transactional
    public ProgresoHuerto getEstadoHuertoDelUsuario(Long maestroId) {
        Maestro maestro = maestroRepository.findById(maestroId)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con ID: " + maestroId));
        Optional<ProgresoHuerto> progresoOpt = progresoHuertoRepository.findByMaestro(maestro);

        if(progresoOpt.isPresent()){
            return progresoOpt.get();
        } else {
            ProgresoHuerto nuevoProgreso = new ProgresoHuerto(maestro);

            return progresoHuertoRepository.save(nuevoProgreso);
        }
    }

    @Transactional
    public ProgresoHuerto actualizarEstadoHuerto(Long maestroId, ProgresoHuerto estadoActualizado){
        Maestro maestro = maestroRepository.findById(maestroId)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con ID: " + maestroId));

        ProgresoHuerto progresoExistente = progresoHuertoRepository.findByMaestro(maestro)
                .orElseThrow(() -> new RuntimeException("Progreso del huerto no encontrado para el maestro con ID: " + maestroId));

        progresoExistente.setEtapa(estadoActualizado.getEtapa());
        progresoExistente.setAgua(estadoActualizado.getAgua());
        progresoExistente.setSol(estadoActualizado.getSol());
        progresoExistente.setRespuestasCorrectas(estadoActualizado.getRespuestasCorrectas());

        return progresoHuertoRepository.save(progresoExistente);
    }
}
