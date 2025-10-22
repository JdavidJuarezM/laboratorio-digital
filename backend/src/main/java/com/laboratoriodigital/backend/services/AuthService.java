package com.laboratoriodigital.backend.services;
import org.springframework.security.authentication.BadCredentialsException;
import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.repositories.MaestroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private MaestroRepository maestroRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Maestro registrarMaestro(String nombre, String email, String password) throws Exception {
        Optional<Maestro> maestroExistente = maestroRepository.findByEmail(email);
        if (maestroExistente.isPresent()) {
            throw new Exception("\"Un usuario ya existe con ese email.");
        }

        Maestro nuevoMaestro = new Maestro();
        nuevoMaestro.setNombre(nombre);
        nuevoMaestro.setEmail(email);

        nuevoMaestro.setPasswordHash(passwordEncoder.encode(password));

        return maestroRepository.save(nuevoMaestro);
    }

    public Maestro autenticarMaestro(String email, String password){
        Maestro maestro = maestroRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Credenciales invalidas"));

        if(!passwordEncoder.matches(password, maestro.getPasswordHash())){
            throw new BadCredentialsException("Credenciales invalidas");
        }
        return maestro;
    }
}
