package br.com.racha.config;

import br.com.racha.controller.AuthController;
import br.com.racha.exception.UnauthorizedException;
import br.com.racha.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final AuthService authService;

    public AuthInterceptor(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Preflight do CORS passa sem token.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        // Cadastro público: qualquer visitante pode criar a própria conta.
        if ("POST".equalsIgnoreCase(request.getMethod()) && "/api/usuarios".equals(request.getRequestURI())) {
            return true;
        }
        String authorization = request.getHeader("Authorization");
        if (authorization == null || authorization.isBlank()) {
            throw new UnauthorizedException("Token ausente. Envie o cabeçalho Authorization: Bearer <token>.");
        }
        authService.validar(AuthController.extrairToken(authorization));
        return true;
    }
}
