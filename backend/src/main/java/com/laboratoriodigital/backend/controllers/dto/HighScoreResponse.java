// backend/src/main/java/com/laboratoriodigital/backend/controllers/dto/HighScoreResponse.java
package com.laboratoriodigital.backend.controllers.dto;

// Este DTO se usa para enviar una respuesta JSON al frontend
// Ejemplo de JSON: { "highScore": 1500 }
public class HighScoreResponse {
    private Integer highScore;

    public HighScoreResponse(Integer highScore) {
        this.highScore = highScore;
    }

    public Integer getHighScore() {
        return highScore;
    }

    public void setHighScore(Integer highScore) {
        this.highScore = highScore;
    }
}