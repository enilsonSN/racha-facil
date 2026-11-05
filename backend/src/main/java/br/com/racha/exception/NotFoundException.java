package br.com.racha.exception;

public class NotFoundException extends RuntimeException {

    public NotFoundException(String entidade, Long id) {
        super(entidade + " com id " + id + " não encontrado(a)");
    }
}
