This design outlines the rules, state management, and turn flow for a strictly luck-based, local multiplayer dice game, optimized for 
conversion into software logic.

---

# 🎲 Fold Flow: Game Implementation Rules

## 1. Game Configuration & Setup

**Inputs:**
1.  **Number of Players (N):** The number of competing players (2+).
2.  **Number of Folds (F):** The number of folds assigned to each player (3–5 recommended).

**Initial Board State:**
*   Each player is assigned a virtual board comprising $F$ distinct Folds.
*   Each fold is a container for 6 slots, labeled 1 through 6.
*   All slots are initially **empty**.

**Goal:**
The objective is to be the first player to fill all $F \times 6$ total slots on your board.

## 2. Core Game State Tracking (Data Model Perspective)

The software must track the following state for every player:

1.  **`Player_ID`**: Unique identifier.
2.  **`Folds`**: The number of folds ($F$).
3.  **`Board_Status`**: A record (e.g., a 2D array or dictionary) tracking the filled status of every slot.
    *   *Structure Example:* `Board_Status[PlayerID][FoldIndex][SlotNumber]` = (Empty / Filled).
4.  **`Completion_Tracker`**: A running count of total slots filled for the player.
5.  **`Game_Order`**: An ordered list of players that tracks the finishing order (1st, 2nd, 3rd, etc.).

## 3. The Turn Sequence (The Engine Loop)

The game proceeds in continuous turns, governed solely by the die roll.

**Turn Start:**
The active player rolls the D6.

**The Placement Check (The Decision Point):**
Let $R$ be the rolled number (1-6).
1.  The system checks the `Board_Status` for the active player.
2.  It counts how many available (empty) slots exist for the number $R$ across all $F$ folds.

### Case A: Placement is Possible (Successful Roll)
*   If the count of empty $R$ slots is greater than zero:
    1.  **Token Placement:** The system places a marker (simulating a coin/token) in the *first available* empty slot matching $R$.
    2.  **State Update:** The `Board_Status` is updated (slot marked as Filled). The `Completion_Tracker` is incremented.
    3.  **Continue Turn:** The active player **does not** end their turn. They must immediately roll the D6 again. (The engine loops back 
to the top of the Turn Sequence).

### Case B: Placement is Impossible (Failed Roll)
*   If the count of empty $R$ slots is zero:
    1.  **Turn End:** The player's turn ends immediately.
    2.  **Turn Passing:** The dice and turn rights pass to the next player in sequence.

## 4. Win Condition and Game Flow

**Winning Turn:**
*   If, upon successful placement (Case A), the player's `Completion_Tracker` reaches $F \times 6$, the player immediately wins the 
round.
*   The winning player is marked as 1st.

**Subsequent Turns:**
*   The game continues until all players have filled their boards.
*   The players are ranked based on the order of their winning turn (1st, 2nd, 3rd, etc.).

## Summary Flowchart

```mermaid
graph TD
    A[Start Turn: Player X] --> B{Roll D6: Result R};
    B --> C{Are R Slots Available on Player X's Board?};
    C -- NO (Failure) --> D[Turn Ends. Pass Dice to Next Player.];
    C -- YES (Success) --> E[Place Token R in First Available Slot.];
    E --> F[Update Board Status & Completion Counter.];
    F --> G{Is Completion Counter = F * 6?};
    G -- YES --> H[Player X Wins! Record Finish Order.];
    G -- NO --> B;  // Loop back to roll again
```

***(This structure is ready for the definition of the architecture, data model, and specific code logic.)***
