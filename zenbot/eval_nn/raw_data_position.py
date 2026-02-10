#claude generated me 100 positions to use for training
#this data is then use in data_prepare to generate for once 
#the data of feed_data.npy
positions = [
    # Opening positions (moves 5-10)
    "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 4",
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    "rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3",
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3",
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
    "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    "rnbqkb1r/pp1p1ppp/4pn2/2p5/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
    
    # Early middlegame (moves 10-15)
    "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 6 6",
    "rnbqk2r/ppp2ppp/4pn2/3p1b2/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 4",
    "r2qkb1r/ppp2ppp/2np1n2/4p1B1/2BPP1b1/2N2N2/PPP2PPP/R2QK2R w KQkq - 4 7",
    "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ - 2 6",
    "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R b KQkq - 0 5",
    "rnbqkb1r/pp3ppp/4pn2/2pp4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 4 3",
    "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 0 4",
    
    # Middlegame positions
    "r2qkb1r/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R b KQkq - 0 7",
    "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 4 8",
    "rnbqk2r/pp3ppp/2p1pn2/3p4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 1 6",
    "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 1 6",
    "r2q1rk1/ppp1bppp/2n1pn2/3p1b2/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 6 9",
    "r1bqk2r/pp1n1ppp/2pbpn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQkq - 2 7",
    "r2qkb1r/pp2pppp/2np1n2/2p5/4P1b1/2NP1NP1/PPP2P1P/R1BQKB1R w KQkq - 2 6",
    "r1bq1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2N1PN2/PP1BBPPP/R2Q1RK1 b - - 8 9",
    "r2qkb1r/1pp2ppp/p1np1n2/4p1B1/2BPP1b1/2N2N2/PPP2PPP/R2QK2R w KQkq - 0 8",
    "r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 8",
    
    # Complex middlegame
    "r2q1rk1/1pp1bppp/p1np1n2/4p1B1/2BPP1b1/2N2N2/PPP1QPPP/R4RK1 w - - 6 11",
    "r1b2rk1/2q1bppp/p2p1n2/npp1p3/4P3/2NPBNP1/PPPQ1PBP/R4RK1 w - - 0 13",
    "r2qr1k1/1p2bppp/p1np1n2/2p1p1B1/4P1b1/2NP1N2/PPPBQPPP/R4RK1 w - - 2 12",
    "2rq1rk1/1p2bppp/p1npbn2/4p3/4P3/1NN1BP2/PPPQ1BPP/2KR3R b - - 8 13",
    "r1bqr1k1/pp1n1ppp/2pbpn2/6B1/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 4 11",
    "r2q1rk1/ppp1bppp/2n1bn2/3pp3/8/1PN1PN2/PBPPQPPP/R4RK1 w - - 6 10",
    "r1bq1rk1/pp1nbppp/4pn2/2pp4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
    "2rq1rk1/pp2bppp/2n1bn2/2pp4/3P4/2NBPNP1/PP2QPBP/R4RK1 b - - 4 12",
    "r1b1r1k1/pp1nqppp/2p1bn2/3p4/3P4/2NBPN2/PP2QPPP/R1B1R1K1 w - - 8 13",
    "r2qr1k1/1pp1bppp/p1np1n2/4p1B1/2BPP1b1/2N2N2/PPP1QPPP/2KR3R b - - 6 12",
    
    # Tactical positions
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4",
    "r1bq1rk1/ppp2ppp/2n2n2/3p4/1b1P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 6 9",
    "r2qkb1r/ppp2ppp/2n2n2/3pp1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 6",
    "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5",
    "r2qkb1r/ppp2ppp/2np1n2/4p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2QK2R w KQkq - 4 7",
    "rnbqk2r/pp3ppp/3bpn2/2pp4/3P4/3BPN2/PP3PPP/RNBQ1RK1 w kq - 2 7",
    "r1bq1rk1/ppp2ppp/2n5/3p4/1b1Pn3/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
    "r1b1kb1r/pppp1ppp/2n2q2/4n3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 6",
    "r2qkb1r/ppp2ppp/2n2n2/3pp1B1/2B1P3/2N2N2/PPPP1PPP/R2QK2R w KQkq - 0 6",
    "r1bqkb1r/pppp1ppp/5n2/4n3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 2 4",
    
    # Imbalanced positions
    "r2q1rk1/3bbppp/p2p1n2/1ppPp3/4P3/2P2NP1/PP1NBPBP/R2Q1RK1 w - - 0 14",
    "2rq1rk1/1p1nbppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQ1BPP/2KR3R w - - 0 14",
    "r3r1k1/1bq1bppp/p2p1n2/1p2p3/4P3/1BP2NP1/PP1N1PBP/R2QR1K1 b - - 0 15",
    "3r2k1/p4ppp/1p1qr3/3p4/3P4/1Q3NP1/PP3PBP/R4RK1 w - - 2 20",
    "r1b1r1k1/2q2ppp/p1n1pn2/1p6/3pN3/P2B1NP1/1P2PPBP/R2Q1RK1 w - - 0 15",
    "2r2rk1/1bq1bppp/p2ppn2/1p6/3NPP2/P1N1B1P1/1PPQ2BP/2KR3R w - - 2 16",
    "r4rk1/1bq1bppp/pp1ppn2/8/3NPP2/2N1B1P1/PPPQ2BP/R4RK1 w - - 0 15",
    "2r1r1k1/p3bppp/1pn1pn2/q7/3P4/2NBPNP1/PP2QPBP/R4RK1 w - - 4 16",
    "r1b2rk1/2q1bppp/p1nppn2/1p6/3NP3/1BN1BP2/PPPQ2PP/R4RK1 b - - 6 13",
    "2r1r1k1/1p1qbppp/p1npbn2/4p3/4P3/1NN1BP2/PPPQ1BPP/2KR3R w - - 6 14",
    
    # Endgame transitions
    "6k1/5ppp/p3p3/1p2P3/1P1r4/P4PPK/5R2/8 w - - 0 35",
    "4r1k1/5ppp/1q2p3/p7/1p6/1P2Q1P1/P4PBP/6K1 w - - 2 32",
    "r5k1/5ppp/4p3/2p5/2P2P2/4P1P1/5PKP/3R4 b - - 0 30",
    "6k1/4rppp/p3p3/1p6/1P2P3/P3KPP1/5R2/8 w - - 4 33",
    "3r2k1/5ppp/4p3/p1p5/P1P2P2/4P1P1/5K1P/3R4 b - - 0 31",
    "8/5pk1/p4p1p/1p6/1P3PP1/P5KP/8/3r4 w - - 0 40",
    "2r3k1/5ppp/4p3/2p5/2P2P2/4P1P1/5K1P/3R4 w - - 2 32",
    "6k1/5pp1/p4p1p/1p6/1P2P3/P4KP1/5R1P/r7 b - - 0 35",
    "4r1k1/6pp/p3pp2/1p6/1P2P3/P3KPP1/7P/3R4 w - - 0 34",
    "8/5pkp/p4p2/1p6/1P3P2/P4KPP/8/3r4 b - - 0 38",
    
    # Rook endgames
    "6k1/5ppp/8/8/8/5PPK/5R2/2r5 w - - 4 40",
    "8/5pk1/6p1/5p2/5P2/6PK/7P/2r2R2 b - - 0 45",
    "6k1/8/6p1/5p1p/5P1P/6PK/8/1r3R2 w - - 2 48",
    "8/8/4kp2/5p2/4KP2/8/8/1r3R2 b - - 0 50",
    "6k1/6p1/6P1/8/8/7K/8/2r2R2 w - - 8 55",
    "8/5pk1/8/5p2/5P2/6PK/8/5R2 b - - 0 52",
    "6k1/8/6pp/8/8/6PK/7P/5R2 w - - 4 50",
    "8/8/5kp1/5p1p/5P1P/6K1/8/5R2 b - - 0 47",
    
    # Pawn endgames
    "8/5pk1/6p1/5p2/5P2/6PK/7P/8 w - - 0 45",
    "8/5pk1/8/4Pp2/5P2/6K1/7P/8 w - f6 0 42",
    "8/8/5kp1/4p1p1/4P1P1/5PK1/8/8 b - - 0 50",
    "8/6k1/6p1/5p2/5P2/6PK/8/8 w - - 2 46",
    "8/8/8/3k1p2/5P2/3K4/8/8 b - - 4 60",
    "8/8/4k3/3p1p2/3P1P2/4K3/8/8 w - - 0 55",
    "8/6p1/5k2/5p2/5P2/6PK/8/8 b - - 0 52",
    "8/8/3k4/2p1p3/2P1P3/3K4/8/8 w - - 0 52",
    
    # Queen endgames
    "6k1/8/6K1/8/8/8/5q2/7Q w - - 8 70",
    "8/8/4k3/8/4K3/8/3q4/6Q1 b - - 2 65",
    "6k1/6p1/6P1/6K1/8/8/3q4/6Q1 w - - 0 68",
    "8/5k2/8/8/5K2/8/3Q4/6q1 b - - 4 72",
    
    # Minor piece endgames
    "6k1/5ppp/8/8/8/5BPK/5N1P/8 w - - 0 40",
    "8/5pk1/6p1/8/8/6BK/5N1P/8 b - - 2 45",
    "6k1/5ppp/8/8/8/5NPK/5B1P/8 w - - 0 42",
    "8/4bpk1/6p1/8/8/6PK/5B1P/8 b - - 0 48",
    "6k1/5ppp/8/8/4n3/5BPK/7P/8 w - - 4 44",
    
    # Opposite-colored bishops
    "6k1/4bpp1/5p1p/8/8/5BPK/6PP/8 w - - 0 45",
    "8/5pk1/6p1/4b1P1/5B2/7K/6PP/8 b - - 0 48",
    
    # Unbalanced material
    "r5k1/5ppp/8/8/8/5QPK/5R1P/8 w - - 0 38",
    "6k1/5ppp/8/8/3q4/5QPK/7P/8 b - - 2 42",
    "2r3k1/5ppp/8/8/5Q2/6PK/7P/8 w - - 4 40",
]