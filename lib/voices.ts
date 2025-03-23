// Voice configurations for different agent types
export const voiceConfigs = {
  historicSites: {
    stevieRayVaughan: {
      voice_id: "VR6AewLTigWG4xSOukaG", // Adam - warm, Texan male voice with southern accent
      settings: {
        stability: 0.85,
        similarity_boost: 0.85
      }
    },
    willieNelson: {
      voice_id: "ThT5KcBeYPX3keUQqHPh", // Josh - deep, mature male voice with Texas drawl
      settings: {
        stability: 0.85,
        similarity_boost: 0.85
      }
    },
    texasCapitol: {
      voice_id: "ErXwobaYiN019PkySvjV", // Antoni - dignified male voice
      settings: {
        stability: 0.85,
        similarity_boost: 0.75
      }
    }
  },
  parksAndNature: {
    bartonSprings: {
      voice_id: "EXAVITQu4vr4xnSDxMaL", // Bella - soothing, gentle female voice
      settings: {
        stability: 0.80,
        similarity_boost: 0.70
      }
    },
    ladyBirdLake: {
      voice_id: "EXAVITQu4vr4xnSDxMaL", // Bella - soothing, gentle female voice
      settings: {
        stability: 0.80,
        similarity_boost: 0.70
      }
    },
    congressBridgeBats: {
      voice_id: "pNInz6obpgDQGcFmaJgB", // Rachel - gentle, informative female voice
      settings: {
        stability: 0.75,
        similarity_boost: 0.75
      }
    },
    treatyOak: {
      voice_id: "ThT5KcBeYPX3keUQqHPh", // Josh - wise, deep male voice
      settings: {
        stability: 0.85,
        similarity_boost: 0.85
      }
    }
  },
  publicArt: {
    iLoveYouSoMuch: {
      voice_id: "EXAVITQu4vr4xnSDxMaL", // Bella - warm, friendly female voice
      settings: {
        stability: 0.70,
        similarity_boost: 0.75
      }
    },
    greetingsFromAustin: {
      voice_id: "yoZ06aMxZJJ28mfd3POQ", // Sam - energetic, enthusiastic male voice
      settings: {
        stability: 0.65,
        similarity_boost: 0.75
      }
    }
  },
  businesses: {
    franklinBarbecue: {
      voice_id: "VR6AewLTigWG4xSOukaG", // Adam - warm, Texan male voice with southern accent
      settings: {
        stability: 0.75,
        similarity_boost: 0.75
      }
    },
    bookPeople: {
      voice_id: "pNInz6obpgDQGcFmaJgB", // Rachel - warm, knowledgeable female voice
      settings: {
        stability: 0.75,
        similarity_boost: 0.75
      }
    }
  }
}; 