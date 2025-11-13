// backend/src/main/java/com/laboratoriodigital/backend/services/MaestroService.java
package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.repositories.MaestroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class MaestroService {

    @Autowired
    private MaestroRepository maestroRepository;


    public Long getCurrentMaestroId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            Maestro maestro = findMaestroByEmail(email);
            if (maestro != null) {
                return maestro.getId();
            }
        }
        throw new RuntimeException("No se pudo obtener el ID del usuario autenticado.");
    }


    public Maestro getCurrentMaestro() {
        Long maestroId = getCurrentMaestroId();
        return maestroRepository.findById(maestroId)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con ID: " + maestroId));
    }


    public Maestro findMaestroByEmail(String email) {
        return maestroRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con email: " + email));
    }


    public Maestro findMaestroById(Long id) {
        return maestroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con ID: " + id));
    }
}