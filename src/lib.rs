#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Env, String, Symbol,
};

// ==================== ESTRUCTURAS DE DATOS ====================

/// Almacena las estadísticas de un vino: puntaje total y cantidad de reseñas.
#[contracttype]
#[derive(Clone, Debug, Default)]
pub struct WineStats {
    pub total_score: u32,
    pub review_count: u32,
}

// ==================== CLAVE PARA EVENTOS ====================

const STATS_KEY: Symbol = symbol_short!("stats");

// ==================== CONTRATO ====================

#[contract]
pub struct CeroChamuyoContract;

#[contractimpl]
impl CeroChamuyoContract {
    /// Deja una reseña para un vino.
    ///
    /// # Argumentos
    /// * `env` - El entorno de ejecución.
    /// * `wine_id` - Identificador único del vino.
    /// * `score` - Puntaje de 1 a 5.
    /// * `ia_notes` - Notas generadas por IA sobre la reseña.
    ///
    /// # Panics
    /// Si el score no está entre 1 y 5.
    ///
    /// # Eventos
    /// Publica un evento con el wine_id, score y ia_notes.
    pub fn dejar_resena(
        env: Env,
        wine_id: u32,
        score: u32,
        ia_notes: String,
    ) {
        // Validar que el score esté entre 1 y 5
        if score < 1 || score > 5 {
            panic!("El score debe estar entre 1 y 5");
        }

        // Obtener las estadísticas actuales o inicializar en 0
        let mut stats: WineStats = env
            .storage()
            .persistent()
            .get(&wine_id)
            .unwrap_or(WineStats {
                total_score: 0,
                review_count: 0,
            });

        // Actualizar estadísticas
        stats.total_score += score;
        stats.review_count += 1;

        // Guardar en storage persistente
        env.storage().persistent().set(&wine_id, &stats);

        // Emitir evento para que el frontend pueda leer los datos sin costos de storage
        let event_data = (wine_id, score, ia_notes.clone());
        env.events().publish((STATS_KEY, symbol_short!("resena")), event_data);
    }

    /// Obtiene el ranking de un vino (solo lectura).
    ///
    /// # Argumentos
    /// * `env` - El entorno de ejecución.
    /// * `wine_id` - Identificador único del vino.
    ///
    /// # Retorna
    /// Una tupla (total_score, review_count) que el frontend puede usar
    /// para calcular el promedio.
    pub fn obtener_ranking(env: Env, wine_id: u32) -> (u32, u32) {
        let stats: WineStats = env
            .storage()
            .persistent()
            .get(&wine_id)
            .unwrap_or(WineStats {
                total_score: 0,
                review_count: 0,
            });

        (stats.total_score, stats.review_count)
    }
}

// ==================== TESTS ====================

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Events;

    #[test]
    fn test_dejar_resena_valida() {
        let env = Env::default();
        let contract_id = env.register(CeroChamuyoContract, ());

        let wine_id = 1u32;
        let score = 5u32;
        let ia_notes = String::from_str(&env, "Excelente vino con notas de roble");

        env.as_contract(&contract_id, || {
            CeroChamuyoContract::dejar_resena(env.clone(), wine_id, score, ia_notes.clone());

            // Verificar que se guardaron las estadísticas
            let (total_score, review_count) = CeroChamuyoContract::obtener_ranking(env.clone(), wine_id);
            assert_eq!(total_score, 5);
            assert_eq!(review_count, 1);
        });

        // Verificar que se publicó el evento
        let events = env.events().all();
        assert_eq!(events.len(), 1);
    }

    #[test]
    fn test_multiple_resenas() {
        let env = Env::default();
        let contract_id = env.register(CeroChamuyoContract, ());

        let wine_id = 1u32;

        env.as_contract(&contract_id, || {
            // Dejar 3 reseñas
            CeroChamuyoContract::dejar_resena(
                env.clone(),
                wine_id,
                5,
                String::from_str(&env, "Primera reseña"),
            );
            CeroChamuyoContract::dejar_resena(
                env.clone(),
                wine_id,
                4,
                String::from_str(&env, "Segunda reseña"),
            );
            CeroChamuyoContract::dejar_resena(
                env.clone(),
                wine_id,
                3,
                String::from_str(&env, "Tercera reseña"),
            );
        });

        // Verificar acumulados
        let (total_score, review_count) = env.as_contract(&contract_id, || {
            CeroChamuyoContract::obtener_ranking(env.clone(), wine_id)
        });
        assert_eq!(total_score, 12); // 5 + 4 + 3
        assert_eq!(review_count, 3);
    }

    #[test]
    #[should_panic(expected = "El score debe estar entre 1 y 5")]
    fn test_score_invalido_cero() {
        let env = Env::default();
        let contract_id = env.register(CeroChamuyoContract, ());

        env.as_contract(&contract_id, || {
            CeroChamuyoContract::dejar_resena(
                env.clone(),
                1u32,
                0,
                String::from_str(&env, "Score inválido"),
            );
        });
    }

    #[test]
    #[should_panic(expected = "El score debe estar entre 1 y 5")]
    fn test_score_invalido_seis() {
        let env = Env::default();
        let contract_id = env.register(CeroChamuyoContract, ());

        env.as_contract(&contract_id, || {
            CeroChamuyoContract::dejar_resena(
                env.clone(),
                1u32,
                6,
                String::from_str(&env, "Score inválido"),
            );
        });
    }

    #[test]
    fn test_vino_sin_resenas() {
        let env = Env::default();
        let contract_id = env.register(CeroChamuyoContract, ());

        // Consultar un vino que no tiene reseñas
        let (total_score, review_count) = env.as_contract(&contract_id, || {
            CeroChamuyoContract::obtener_ranking(env.clone(), 999u32)
        });
        assert_eq!(total_score, 0);
        assert_eq!(review_count, 0);
    }
}
