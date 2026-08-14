// Authoritative subclass ability data extracted from the Sunrise/Shadowkeep
// Ability/attunement data thanks to Kyle Thompson's Sundial (https://github.com/KyleThmpsn/sundial),
// which reads these values from the Shadowkeep game files.
// game files (via the Sundial catalog). Each subclass has 3 attunements (trees);
// picking one sets super_ability + melee_ability as a pair.
window.SUNRISE_ABILITIES = {
 "perClass": {
  "0": {
   "movement": [
    {
     "v": 4,
     "label": "High Lift"
    },
    {
     "v": 5,
     "label": "Strafe Lift"
    },
    {
     "v": 6,
     "label": "Catapult Lift"
    }
   ],
   "class_ability": [
    {
     "v": 2,
     "label": "Towering Barricade"
    },
    {
     "v": 3,
     "label": "Rally Barricade"
    }
   ]
  },
  "1": {
   "movement": [
    {
     "v": 4,
     "label": "High Jump"
    },
    {
     "v": 5,
     "label": "Strafe Jump"
    },
    {
     "v": 6,
     "label": "Triple Jump"
    }
   ],
   "class_ability": [
    {
     "v": 2,
     "label": "Marksman's Dodge"
    },
    {
     "v": 3,
     "label": "Gambler's Dodge"
    }
   ]
  },
  "2": {
   "movement": [
    {
     "v": 4,
     "label": "Strafe Glide"
    },
    {
     "v": 5,
     "label": "Blink"
    },
    {
     "v": 6,
     "label": "Burst Glide"
    }
   ],
   "class_ability": [
    {
     "v": 2,
     "label": "Healing Rift"
    },
    {
     "v": 3,
     "label": "Empowering Rift"
    }
   ]
  }
 },
 "bySubclass": {
  "0XB0554739": {
   "grenade": [
    {
     "v": 7,
     "label": "Lightning Grenade"
    },
    {
     "v": 8,
     "label": "Flashbang Grenade"
    },
    {
     "v": 9,
     "label": "Pulse Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Code of the Earthshaker",
     "super": {
      "v": 10,
      "label": "Fists of Havoc"
     },
     "melee": {
      "v": 11,
      "label": "Seismic Strike"
     }
    },
    {
     "name": "Code of the Juggernaut",
     "super": {
      "v": 10,
      "label": "Fists of Havoc"
     },
     "melee": {
      "v": 15,
      "label": "Frontal Assault"
     }
    },
    {
     "name": "Code of the Missile",
     "super": {
      "v": 20,
      "label": "Thundercrash"
     },
     "melee": {
      "v": 21,
      "label": "Ballistic Slam"
     }
    }
   ]
  },
  "0XB920CE9A": {
   "grenade": [
    {
     "v": 7,
     "label": "Fusion Grenade"
    },
    {
     "v": 8,
     "label": "Incendiary Grenade"
    },
    {
     "v": 9,
     "label": "Thermite Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Code of the Fire-Forged",
     "super": {
      "v": 10,
      "label": "Hammer of Sol"
     },
     "melee": {
      "v": 11,
      "label": "Hammer Strike"
     }
    },
    {
     "name": "Code of the Siegebreaker",
     "super": {
      "v": 10,
      "label": "Hammer of Sol"
     },
     "melee": {
      "v": 15,
      "label": "Mortar Blast"
     }
    },
    {
     "name": "Code of the Devastator",
     "super": {
      "v": 20,
      "label": "Burning Maul"
     },
     "melee": {
      "v": 21,
      "label": "Throwing Hammer"
     }
    }
   ]
  },
  "0XC99B33E9": {
   "grenade": [
    {
     "v": 7,
     "label": "Suppressor Grenade"
    },
    {
     "v": 8,
     "label": "Magnetic Grenade"
    },
    {
     "v": 9,
     "label": "Voidwall Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Code of the Protector",
     "super": {
      "v": 10,
      "label": "Sentinel Shield"
     },
     "melee": {
      "v": 11,
      "label": "Defensive Strike"
     }
    },
    {
     "name": "Code of the Aggressor",
     "super": {
      "v": 10,
      "label": "Sentinel Shield"
     },
     "melee": {
      "v": 15,
      "label": "Shield Bash"
     }
    },
    {
     "name": "Code of the Commander",
     "super": {
      "v": 20,
      "label": "Banner Shield"
     },
     "melee": {
      "v": 21,
      "label": "Tactical Strike"
     }
    }
   ]
  },
  "0XD8B8D1FC": {
   "grenade": [
    {
     "v": 7,
     "label": "Tripmine Grenade"
    },
    {
     "v": 8,
     "label": "Incendiary Grenade"
    },
    {
     "v": 9,
     "label": "Swarm Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Way of the Outlaw",
     "super": {
      "v": 10,
      "label": "Golden Gun"
     },
     "melee": {
      "v": 11,
      "label": "Proximity Explosive Knife"
     }
    },
    {
     "name": "Way of the Sharpshooter",
     "super": {
      "v": 10,
      "label": "Golden Gun"
     },
     "melee": {
      "v": 15,
      "label": "Weighted Knife"
     }
    },
    {
     "name": "Way of a Thousand Cuts",
     "super": {
      "v": 20,
      "label": "Blade Barrage"
     },
     "melee": {
      "v": 21,
      "label": "Knife Trick"
     }
    }
   ]
  },
  "0X4F91DC97": {
   "grenade": [
    {
     "v": 7,
     "label": "Arcbolt Grenade"
    },
    {
     "v": 8,
     "label": "Skip Grenade"
    },
    {
     "v": 9,
     "label": "Flux Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Way of the Warrior",
     "super": {
      "v": 10,
      "label": "Arc Staff"
     },
     "melee": {
      "v": 11,
      "label": "Combination Blow"
     }
    },
    {
     "name": "Way of the Wind",
     "super": {
      "v": 10,
      "label": "Arc Staff"
     },
     "melee": {
      "v": 15,
      "label": "Disorienting Blow"
     }
    },
    {
     "name": "Way of the Current",
     "super": {
      "v": 20,
      "label": "Whirlwind Guard"
     },
     "melee": {
      "v": 21,
      "label": "Tempest Strike"
     }
    }
   ]
  },
  "0XC0483D8B": {
   "grenade": [
    {
     "v": 7,
     "label": "Voidwall Grenade"
    },
    {
     "v": 8,
     "label": "Vortex Grenade"
    },
    {
     "v": 9,
     "label": "Spike Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Way of the Trapper",
     "super": {
      "v": 10,
      "label": "Shadowshot"
     },
     "melee": {
      "v": 11,
      "label": "Snare Bomb"
     }
    },
    {
     "name": "Way of the Pathfinder",
     "super": {
      "v": 10,
      "label": "Shadowshot"
     },
     "melee": {
      "v": 15,
      "label": "Vanish in Smoke"
     }
    },
    {
     "name": "Way of the Wraith",
     "super": {
      "v": 20,
      "label": "Spectral Blades"
     },
     "melee": {
      "v": 21,
      "label": "Corrosive Smoke"
     }
    }
   ]
  },
  "0XCF88FEA5": {
   "grenade": [
    {
     "v": 7,
     "label": "Fusion Grenade"
    },
    {
     "v": 8,
     "label": "Solar Grenade"
    },
    {
     "v": 9,
     "label": "Firebolt Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Attunement of Sky",
     "super": {
      "v": 10,
      "label": "Daybreak"
     },
     "melee": {
      "v": 11,
      "label": "Celestial Fire"
     }
    },
    {
     "name": "Attunement of Flame",
     "super": {
      "v": 10,
      "label": "Daybreak"
     },
     "melee": {
      "v": 15,
      "label": "Igniting Touch"
     }
    },
    {
     "name": "Attunement of Grace",
     "super": {
      "v": 20,
      "label": "Well of Radiance"
     },
     "melee": {
      "v": 21,
      "label": "Guiding Flame"
     }
    }
   ]
  },
  "0X686A154A": {
   "grenade": [
    {
     "v": 7,
     "label": "Storm Grenade"
    },
    {
     "v": 8,
     "label": "Arcbolt Grenade"
    },
    {
     "v": 9,
     "label": "Pulse Grenade"
    }
   ],
   "attunements": [
    {
     "name": "Attunement of Conduction",
     "super": {
      "v": 10,
      "label": "Stormtrance"
     },
     "melee": {
      "v": 11,
      "label": "Chain Lightning"
     }
    },
    {
     "name": "Attunement of the Elements",
     "super": {
      "v": 10,
      "label": "Stormtrance"
     },
     "melee": {
      "v": 15,
      "label": "Rising Storm"
     }
    },
    {
     "name": "Attunement of Control",
     "super": {
      "v": 20,
      "label": "Chaos Reach"
     },
     "melee": {
      "v": 21,
      "label": "Ball Lightning"
     }
    }
   ]
  },
  "0XE7BC88B0": {
   "grenade": [
    {
     "v": 7,
     "label": "Scatter Grenade"
    },
    {
     "v": 8,
     "label": "Vortex Grenade"
    },
    {
     "v": 9,
     "label": "Axion Bolt"
    }
   ],
   "attunements": [
    {
     "name": "Attunement of Chaos",
     "super": {
      "v": 10,
      "label": "Nova Bomb"
     },
     "melee": {
      "v": 11,
      "label": "Entropic Pull"
     }
    },
    {
     "name": "Attunement of Hunger",
     "super": {
      "v": 10,
      "label": "Nova Bomb"
     },
     "melee": {
      "v": 15,
      "label": "Devour"
     }
    },
    {
     "name": "Attunement of Fission",
     "super": {
      "v": 20,
      "label": "Nova Warp"
     },
     "melee": {
      "v": 21,
      "label": "Atomic Breach"
     }
    }
   ]
  }
 }
};
