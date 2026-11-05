package br.com.racha.repository;

import br.com.racha.domain.SessaoToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessaoTokenRepository extends JpaRepository<SessaoToken, String> {
}
