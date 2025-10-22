package com.laboratoriodigital.backend.security;

import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.repositories.MaestroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.security.core.GrantedAuthority; // Interfaz para autoridades
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Implementación simple
import java.util.Collections; // Para crear una lista con un solo elemento

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private MaestroRepository maestroRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
       Maestro maestro = maestroRepository.findByEmail(email)
               .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");

       return new User(
               maestro.getEmail(),
               maestro.getPasswordHash(),
               Collections.singletonList(authority)
       );
    }
}
