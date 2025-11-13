package com.laboratoriodigital.backend.controllers.dto;


public class ProgresoHuertoDTO {
    private Integer etapa;
    private Integer agua;
    private Integer sol;
    private Integer respuestasCorrectas;

    public ProgresoHuertoDTO() {
    }

    public ProgresoHuertoDTO(Integer etapa, Integer agua, Integer sol, Integer respuestasCorrectas) {
        this.etapa = etapa;
        this.agua = agua;
        this.sol = sol;
        this.respuestasCorrectas = respuestasCorrectas;
    }

    public Integer getEtapa() {
        return etapa;
    }

    public void setEtapa(Integer etapa) {
        this.etapa = etapa;
    }

    public Integer getAgua() {
        return agua;
    }

    public void setAgua(Integer agua) {
        this.agua = agua;
    }

    public Integer getSol() {
        return sol;
    }

    public void setSol(Integer sol) {
        this.sol = sol;
    }

    public Integer getRespuestasCorrectas() {
        return respuestasCorrectas;
    }

    public void setRespuestasCorrectas(Integer respuestasCorrectas) {
        this.respuestasCorrectas = respuestasCorrectas;
    }

}
