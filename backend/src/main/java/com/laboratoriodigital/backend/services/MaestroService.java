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

    /**
     * Obtiene el ID del Maestro actualmente autenticado a partir del contexto de seguridad.
     * @return El ID (Long) del Maestro.
     * @throws RuntimeException si no se puede encontrar un usuario autenticado.
     */
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

    /**
     * Obtiene la entidad Maestro completa del usuario actualmente autenticado.
     * @return El objeto Maestro.
     * @throws RuntimeException si no se puede encontrar un usuario autenticado.
     */
    public Maestro getCurrentMaestro() {
        Long maestroId = getCurrentMaestroId();
        return maestroRepository.findById(maestroId)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con ID: " + maestroId));
    }

    /**
     * Busca un Maestro por su email.
     * @param email El email a buscar.
     * @return El objeto Maestro encontrado.
     * @throws RuntimeException si no se encuentra el maestro.
     */
    public Maestro findMaestroByEmail(String email) {
        return maestroRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con email: " + email));
    }

    /**
     * Busca un Maestro por su ID.
     * @param id El ID a buscar.
     * @return El objeto Maestro encontrado.
     * @throws RuntimeException si no se encuentra el maestro.
     */
    public Maestro findMaestroById(Long id) {
        return maestroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maestro no encontrado con ID: " + id));
    }
}