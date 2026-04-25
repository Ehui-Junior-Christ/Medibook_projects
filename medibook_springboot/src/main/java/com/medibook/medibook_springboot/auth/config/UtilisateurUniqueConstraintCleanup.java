package com.medibook.medibook_springboot.auth.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class UtilisateurUniqueConstraintCleanup {

    private static final List<String> TARGET_COLUMNS = List.of("cmu", "telephone", "email");

    private final JdbcTemplate jdbcTemplate;

    public UtilisateurUniqueConstraintCleanup(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void dropLegacyUniqueIndexes() {
        List<Map<String, Object>> indexes = jdbcTemplate.queryForList("""
                SELECT INDEX_NAME, COLUMN_NAME
                FROM information_schema.statistics
                WHERE table_schema = DATABASE()
                  AND table_name = 'utilisateurs'
                  AND non_unique = 0
                  AND index_name <> 'PRIMARY'
                """);

        for (Map<String, Object> index : indexes) {
            String columnName = String.valueOf(index.get("COLUMN_NAME"));
            if (!TARGET_COLUMNS.contains(columnName)) {
                continue;
            }

            String indexName = String.valueOf(index.get("INDEX_NAME"));
            jdbcTemplate.execute("ALTER TABLE utilisateurs DROP INDEX `" + indexName + "`");
        }
    }
}
