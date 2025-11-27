package com.laboratoriodigital.backend.services;

import com.laboratoriodigital.backend.models.Alumno;
import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.repositories.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private MaestroService maestroService;

    // Obtener alumnos solo del maestro logueado
    public List<Alumno> obtenerAlumnosDelMaestro() {
        Maestro maestro = maestroService.getCurrentMaestro();
        return alumnoRepository.findByMaestro(maestro);
    }

    // Crear un alumno vinculado al maestro logueado
    public Alumno crearAlumno(String nombre) {
        Maestro maestro = maestroService.getCurrentMaestro();
        Alumno alumno = new Alumno();
        alumno.setNombre(nombre);
        alumno.setMaestro(maestro);
        return alumnoRepository.save(alumno);
    }

    // Eliminar alumno (verificando que pertenezca al maestro)
    public void eliminarAlumno(Long id) {
        Maestro maestro = maestroService.getCurrentMaestro();
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        if (!alumno.getMaestro().getId().equals(maestro.getId())) {
            throw new RuntimeException("No tienes permiso para eliminar este alumno");
        }
        alumnoRepository.delete(alumno);
    }

    // Actualizar progreso
    public Alumno actualizarProgreso(Long id, Integer etapa, Integer aciertos) {
        // Nota: Aquí no verificamos maestro estricto para permitir que el alumno juegue
        // pero idealmente deberías validar tokens o sesiones.
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        alumno.setEtapa(etapa);
        // Sumamos aciertos o los reemplazamos, según tu lógica. Aquí reemplazo.
        alumno.setAciertos(aciertos);
        return alumnoRepository.save(alumno);
    }
}