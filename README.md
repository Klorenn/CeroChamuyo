# CeroChamuyo

La verdad del vino, en la blockchain.

Reseñas de vinos mendocinos auditadas por IA. Inmutabilidad garantizada por Stellar. Sin chamuyo, solo verdad.

---

## Descripcion

CeroChamuyo es una aplicacion descentralizada que permite dejar reseñas de vinos en la blockchain de Stellar. Cada resena es:
- Analizada por IA para generar notas de sommelier
- Firmada con tu wallet Freighter
- Almacenada permanentemente en el smart contract Soroban
- Verificable en cualquier momento via Stellar Expert

---

## Stack Tecnico

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Smart Contract**: Soroban (Rust)
- **Blockchain**: Stellar Testnet
- **Wallet**: Freighter

---

## Smart Contract

### Informacion del Deploy

| Red | Contract ID |
|-----|------------|
| Testnet | `CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW` |

[Verificar en Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW)

### Funciones

**dejar_resena(wine_id, score, ia_notes)**
Deja una nueva resena para un vino con puntuacion de 1 a 5.

**obtener_ranking(wine_id)**
Retorna (total_score, review_count) para calcular promedios.

---

## Vinos de Mendoza

El sistema incluye 29 vinos mendocinos organizados en categorias:

### Iconos y Alta Gama
1. Nicolas Catena Zapata - Valle de Uco
2. Finca Piedra Infinita - Paraje Altamira
3. Gran Enemigo Gualtallary - Gualtallary
4. Vina Cobos Chanares - Valle de Uco
5. Cheval des Andes - Las Compuertas
6. Felipe Rutini - Valle de Uco

### Gama Media-Alta
7. Luigi Bosca De Sangre - Lujan de Cuyo
8. D.V. Catena - Valle de Uco
9. Numina - Valle de Uco
10. Gran Dante - Lujan de Cuyo
11. Bramare - Valle de Uco
12. Lote 51 Malbec - Lujan de Cuyo

### Clasicos y Best Sellers
13. Trumpeter - Valle de Uco
14. Terrazas Reserva Malbec - Valle de Uco
15. Terrazas Reserva Chardonnay - Valle de Uco
16. Alamos Malbec - Mendoza
17. Nicasia Red Blend - Altamira
18. Septima Obra - Agrelo
19. El Esteco Don David Cabernet Sauvignon - Mendoza

### Blancos y Rosados
20. White Bones Chardonnay - Gualtallary
21. White Stones Chardonnay - Gualtallary
22. Zuccardi Poligonos Verdejo - Valle de Uco
23. Zuccardi Poligonos Semillon - Valle de Uco
24. Lagarde Goes Pink - Lujan de Cuyo
25. Susana Balbo Signature White Blend - Valle de Uco

### Espumantes
26. Chandon Extra Brut - Mendoza
27. Chandon Methode Traditionnelle Extra Brut - Mendoza
28. Alyda Van Dulken - Valle de Uco
29. Cruzat Rose - Mendoza

---

## Como Usar

### 1. Conectar Wallet

Instala la extension [Freighter](https://freighter.app/) y crea una wallet en Testnet.

### 2. Obtener XLM de Testnet

Visita [Stellar Testnet Friendbot](https://friendbot.stellar.org/) para recibir XLM de prueba.

### 3. Dejar una Resena

1. Selecciona el vino del dropdown
2. Dale una puntuacion con las estrellas
3. Escribe tu opinion honesta
4. Haz click en "Sellar en Stellar"
5. Confirma la transaccion en Freighter

### 4. Verificar en Blockchain

Una vez enviada, puedes verificar tu resena en [Stellar Expert](https://stellar.expert/explorer/testnet/).

---

## Desarrollo Local

### Requisitos

- Node.js 20+
- Rust 1.70+
- npm o pnpm

### Instalar dependencias

```bash
cd "Cero Chamuyo"
npm install
```

### Iniciar dev server

```bash
npm run dev
```

La app estara disponible en http://localhost:3000

### Compilar smart contract

```bash
cargo build --release
```

### Ejecutar tests

```bash
cargo test
```

---

## Estructura del Proyecto

```
CeroChamuyo/
├── Cero Chamuyo/          # Frontend Next.js
│   ├── app/              # Paginas y layouts
│   ├── components/        # Componentes React
│   ├── hooks/            # Custom hooks (useFreighter)
│   └── lib/              # Utilidades y SDK
├── src/                   # Smart contract Rust
│   └── lib.rs            # Logica del contrato
├── wines_data.json        # Base de datos de vinos
└── Cargo.toml            # Configuracion Rust
```

---

## Licencia

MIT License

---

## Enlaces

- [Stellar Expert - Smart Contract](https://stellar.expert/explorer/testnet/contract/CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW)
- [Documentacion Soroban](https://soroban.stellar.org/docs)
- [Stellar Developers](https://developers.stellar.org)
- [Freighter Wallet](https://freighter.app/)
