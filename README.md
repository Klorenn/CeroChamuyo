# CeroChamuyo Contract 🍷

Contrato inteligente Soroban para gestión de reseñas y ranking de vinos en Stellar.

[![Stellar Expert](https://img.shields.io/badge/Stellar.Expert-Verify-blue)](https://stellar.expert/explorer/testnet/contract/CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-purple)](https://stellar.org)
[![Soroban SDK](https://img.shields.io/badge/Soroban-SDK-orange)](https://soroban.stellar.org)

---

## 📋 Descripción

**CeroChamuyoContract** es un contrato inteligente que permite:

- Dejar reseñas de vinos con puntuación (1-5) y notas IA
- Almacenar estadísticas on-chain (puntaje total y cantidad de reseñas)
- Obtener datos para calcular rankings en tiempo real
- Emitir eventos para lectura eficiente por el frontend

---

## 🚀 Deploy en Producción

| Red | Address del Contrato | Verificador |
|-----|---------------------|-------------|
| **Testnet** | `CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW` | [Ver en Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW) |

### Transacciones de Deploy

| Tipo | Hash | Explorer |
|------|------|----------|
| Install Wasm | `b6f1a7807fe58133594baa8b63ff83a712aabf8a6953390a8f8444aff3f56b64` | [Ver](https://stellar.expert/explorer/testnet/tx/b6f1a7807fe58133594baa8b63ff83a712aabf8a6953390a8f8444aff3f56b64) |
| Deploy Contract | `2efef2ff98008620a81187293403274da9b3b375de32bb8430f7773361e5075f` | [Ver](https://stellar.expert/explorer/testnet/tx/2efef2ff98008620a81187293403274da9b3b375de32bb8430f7773361e5075f) |

### Wasm Hash

```
38109224ea039a77635905375c9ee0401efdbec8dd3cc7cab108d67e6348496e
```

---

## 📊 Ranking On-Chain (Datos Reales)

Estado actual del contrato verificado en Stellar Expert:

| Rank | Vino | Total Score | Reviews | Promedio | Verificar |
|------|------|-------------|---------|----------|-----------|
| 1 | Catena Zapata Malbec Argentino | 9 | 2 | 4.5 | [Ver](https://stellar.expert/explorer/testnet/contract/CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW) |
| 2 | Vega Sicilia Único | 5 | 1 | 5.0 | [Ver](https://stellar.expert/explorer/testnet/tx/919e0df02e114d05bc27eb7646721a87927e05548d41815c574562a7e5877c0e) |
| 3 | Château Margaux | 5 | 1 | 5.0 | [Ver](https://stellar.expert/explorer/testnet/tx/05ea0740facd8afa40a718a64f81f910b03cc05ccf38f3f21089e3c9807d5f23) |
| 4 | Penfolds Grange | 5 | 1 | 5.0 | [Ver](https://stellar.expert/explorer/testnet/tx/33daf7461d81413d2533a6111152055305a206cbf8ef577aeb2cbdffc1edcedf) |
| 5 | Antinori Tignanello | 5 | 1 | 5.0 | [Ver](https://stellar.expert/explorer/testnet/tx/20cc94d976937084863a5a8f3f75d74907c8e9f57c68671eb902f22f2ddca89d) |
| 6 | Dom Pérignon Vintage | 5 | 1 | 5.0 | [Ver](https://stellar.expert/explorer/testnet/tx/eb0ab4606e52f596aed4f204cacffd7ff189c4cddc45b76582bd8b0beef7e95d) |

### Reseñas On-Chain Verificables

| Vino | Score | Notas IA | TX Hash |
|------|-------|----------|---------|
| Catena Zapata (1ª) | ⭐⭐⭐⭐⭐ | "Excelente Malbec con notas de ciruela negra, violetas y un toque de roble francés..." | [af3419...](https://stellar.expert/explorer/testnet/tx/af341992cb6c0147e4b119aa5325035450b253be5a43a603a0c09aa5417d3a81) |
| Catena Zapata (2ª) | ⭐⭐⭐⭐ | "Muy buen Malbec, fruta roja intensa y especias..." | [4b5344...](https://stellar.expert/explorer/testnet/tx/4b534419f49cb2a8f6f6237a76856f299913a8d83d661937faa1c8b78519cb0f) |
| Vega Sicilia Único | ⭐⭐⭐⭐⭐ | "Obra maestra de Ribera del Duero. Complejidad extraordinaria..." | [919e0d...](https://stellar.expert/explorer/testnet/tx/919e0df02e114d05bc27eb7646721a87927e05548d41815c574562a7e5877c0e) |
| Château Margaux | ⭐⭐⭐⭐⭐ | "Elegancia pura con aromas de rosas, cassis y especias..." | [05ea07...](https://stellar.expert/explorer/testnet/tx/05ea0740facd8afa40a718a64f81f910b03cc05ccf38f3f21089e3c9807d5f23) |
| Penfolds Grange | ⭐⭐⭐⭐⭐ | "El ícono australiano. Shiraz potente con chocolate negro..." | [33daf7...](https://stellar.expert/explorer/testnet/tx/33daf7461d81413d2533a6111152055305a206cbf8ef577aeb2cbdffc1edcedf) |
| Tignanello | ⭐⭐⭐⭐⭐ | "Super toscano clásico. Sangiovese vibrante con cereza..." | [20cc94...](https://stellar.expert/explorer/testnet/tx/20cc94d976937084863a5a8f3f75d74907c8e9f57c68671eb902f22f2ddca89d) |
| Dom Pérignon | ⭐⭐⭐⭐⭐ | "Champagne de guarda excepcional. Brioche, almendras tostadas..." | [eb0ab4...](https://stellar.expert/explorer/testnet/tx/eb0ab4606e52f596aed4f204cacffd7ff189c4cddc45b76582bd8b0beef7e95d) |

---

## 📐 Estructura de Datos

### WineStats

```rust
pub struct WineStats {
    pub total_score: u32,      // Suma acumulada de todos los puntajes
    pub review_count: u32,     // Cantidad total de reseñas recibidas
}
```

Cada vino tiene su propio `WineStats` almacenado en el storage persistente del contrato, mapeado por su `wine_id`.

---

## 🔧 Funciones del Contrato

### `dejar_resena`

Deja una nueva reseña para un vino.

```rust
pub fn dejar_resena(
    env: Env,
    wine_id: u32,
    score: u32,
    ia_notes: String,
)
```

**Parámetros:**
| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `env` | `Env` | Entorno de ejecución de Soroban |
| `wine_id` | `u32` | Identificador único del vino |
| `score` | `u32` | Puntaje de 1 a 5 |
| `ia_notes` | `String` | Notas generadas por IA |

**Validaciones:**
- El `score` debe estar entre 1 y 5 (inclusive). Si no, la transacción hace **panic**.

**Eventos emitidos:**
```rust
// Topic: (Symbol("stats"), Symbol("resena"))
// Data: (wine_id: u32, score: u32, ia_notes: String)
```

---

### `obtener_ranking`

Obtiene las estadísticas de un vino (solo lectura).

```rust
pub fn obtener_ranking(env: Env, wine_id: u32) -> (u32, u32)
```

**Retorna:**
- Tupla `(total_score, review_count)`

**Cálculo del promedio:**
```javascript
const promedio = total_score / review_count;
```

---

## 🧪 Uso desde el Frontend

### Ejemplo con @stellar/freighter

```javascript
import { Contract, SorobanRpc, Address } from '@stellar/stellar-sdk';

const CONTRACT_ID = 'CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW';
const NETWORK = 'testnet';

// Inicializar
const server = new SorobanRpc.Server('https://soroban-test.stellar.org', {
  networkPassphrase: SorobanRpc.Networks.TESTNET
});
const contract = new Contract(CONTRACT_ID);

// Obtener ranking de un vino
async function getWineRanking(wineId) {
  const result = await server.simulateTransaction(
    contract.call('obtener_ranking', wineId)
  );

  const [totalScore, reviewCount] = result.result.retval;
  const average = reviewCount > 0 ? totalScore / reviewCount : 0;

  return { totalScore, reviewCount, average };
}

// Dejar una reseña
async function submitReview(wineId, score, iaNotes, wallet) {
  const tx = await contract.call(
    'dejar_resena',
    wineId,
    score,
    iaNotes
  );

  const prepared = await server.prepareTransaction(tx);
  const signed = await wallet.signTransaction(prepared);
  const result = await server.sendTransaction(signed);

  return result;
}

// Escuchar eventos de reseñas
async function getReviewEvents(wineId) {
  const events = await server.getEvents({
    startLedger: 1,
    filters: [{
      type: 'contract',
      contractIds: [CONTRACT_ID]
    }]
  });

  return events.filter(e =>
    e.topic.some(t => t.switch() === stellar.xdr.ScValType.scvSymbol &&
                       t.sym().toString('utf8') === 'resena')
  );
}
```

---

## 📊 Dataset de Vinos Reales

El contrato usa IDs numéricos para vinos reales. Aquí está el mapeo:

| Wine ID | Vino | Región | País | Uva |
|---------|------|--------|------|-----|
| 1 | **Catena Zapata Malbec Argentino** | Mendoza | 🇦🇷 Argentina | Malbec |
| 2 | **Vega Sicilia Único** | Ribera del Duero | 🇪🇸 España | Tempranillo, Cabernet Sauvignon |
| 3 | **Opus One** | Napa Valley | 🇺🇸 USA | Cabernet Sauvignon blend |
| 4 | **Château Margaux** | Bordeaux | 🇫🇷 Francia | Cabernet Sauvignon, Merlot |
| 5 | **Penfolds Grange** | South Australia | 🇦🇺 Australia | Shiraz |
| 6 | **Antinori Tignanello** | Toscana | 🇮🇹 Italia | Sangiovese, Cabernet |
| 7 | **Cloudy Bay Sauvignon Blanc** | Marlborough | 🇳🇿 Nueva Zelanda | Sauvignon Blanc |
| 8 | **Dom Pérignon Vintage** | Champagne | 🇫🇷 Francia | Chardonnay, Pinot Noir |
| 9 | **Krug Grande Cuvée** | Champagne | 🇫🇷 Francia | Chardonnay, Pinot Noir, Pinot Meunier |
| 10 | **Robert Mondavi Reserve Cabernet** | Napa Valley | 🇺🇸 USA | Cabernet Sauvignon |

### Puntuaciones de Referencia (para testing)

Estas puntuaciones son de referencia basadas en críticos reconocidos:

| Wine ID | Puntuación Crítico | Fuente |
|---------|-------------------|--------|
| 1 | 97 | Robert Parker |
| 2 | 99 | James Suckling |
| 3 | 95 | Wine Spectator |
| 4 | 100 | Decanter |
| 5 | 98 | James Halliday |
| 6 | 96 | Wine Enthusiast |
| 7 | 91 | Tim Atkin |
| 8 | 98 | Wine Advocate |
| 9 | 99 | Guia Peñín |
| 10 | 94 | Jeb Dunnuck |

---

## 🛠️ Desarrollo Local

### Prerrequisitos

- [Rust](https://rustup.rs/) (1.70+)
- [Stellar CLI](https://github.com/StellarCN/py-stellar-base)
- Cargo

### Compilar

```bash
# Build estándar
cargo build --release

# Build con Stellar CLI (recomendado)
stellar contract build
```

### Ejecutar Tests

```bash
cargo test
```

### Deploy Local

```bash
# 1. Configurar red y cuenta
stellar network add testnet \
  --rpc-url https://soroban-test.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

stellar keys generate testnet-user

# 2. Deploy
stellar contract deploy \
  --network testnet \
  --source-account testnet-user \
  --wasm target/wasm32v1-none/release/cerochamuyo_contract.wasm
```

---

## 📜 Licencia

MIT License

---

## 🔗 Enlaces

- [Stellar Expert - Contrato Verificado](https://stellar.expert/explorer/testnet/contract/CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Developers](https://developers.stellar.org)

---

<div align="center">
  <strong>CeroChamuyo Contract</strong> | Built with Soroban SDK 🍷
</div>
