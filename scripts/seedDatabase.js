/* ════════════════════════════════════════
        scripts/seedDatabase.js
/════════════════════════════════════════ */

// ** IMPORTS **
import dotenv from 'dotenv'
import Breed from '../src/models/Breed.js'
import { connectDB } from '../src/config/database.js'

dotenv.config()

// Races data
const breedsData = [
  {
    name: 'Staffordshire Bull Terrier',
    description: 'Le Staffordshire Bull Terrier est un chien musclé et courageux, reconnu pour son affection exceptionnelle envers les humains, particulièrement les enfants. Malgré son apparence imposante, c\'est un compagnon doux, loyal et joueur qui forme des liens très forts avec sa famille.',
    characteristics: {
      size: 'medium',
      weight: { min: 11, max: 17 },
      height: { min: 36, max: 41 },
      temperament: ['courageux', 'affectueux', 'loyal', 'intelligent'],
      activityLevel: 'high',
      lifeExpectancy: { min: 12, max: 14 }
    },
    origin: 'Angleterre',
    care: {
      grooming: 'Pelage court et lisse nécessitant un brossage hebdomadaire et des bains occasionnels.',
      exercise: 'Besoins élevés en exercice - 1 à 2 heures par jour incluant jeux et promenades.',
      diet: '200-300g de croquettes de qualité par jour, adaptées à son niveau d\'activité.'
    },
    health: {
      commonIssues: ['Dysplasie de la hanche', 'Cataracte', 'Problèmes cutanés'],
      preventiveCare: 'Visites vétérinaires régulières, surveillance oculaire, soins dentaires.'
    }
  },
  {
    name: 'Labrador Retriever',
    description: 'Le Labrador est un chien au tempérament équilibré et à l\'âme douce, qui ne demande qu\'à jouer, nager et rapporter avec sa famille. Cette race intelligente et athlétique est désireuse de plaire à son maître et devient un ami fidèle pour toute la famille.',
    characteristics: {
      size: 'large',
      weight: { min: 25, max: 36 },
      height: { min: 55, max: 57 },
      temperament: ['amical', 'sociable', 'équilibré', 'loyal'],
      activityLevel: 'high',
      lifeExpectancy: { min: 10, max: 12 }
    },
    origin: 'Canada',
    care: {
      grooming: 'Les Labradors perdent beaucoup de poils et nécessitent un brossage régulier pour gérer la mue.',
      exercise: 'Les Labradors ont besoin d\'au moins 1 à 2 heures d\'exercice quotidien pour rester en bonne santé.',
      diet: 'Croquettes de qualité, 300-400g par jour, ajustées selon le niveau d\'activité et l\'âge.'
    },
    health: {
      commonIssues: ['Dysplasie de la hanche', 'Dysplasie du coude', 'Atrophie rétinienne progressive'],
      preventiveCare: 'Visites vétérinaires régulières, maintien d\'un poids sain, exercice approprié.'
    }
  },
  {
    name: 'Berger Allemand',
    description: 'Les Bergers Allemands sont de grands chiens athlétiques au caractère noble et à l\'intelligence élevée. Loyaux, courageux et très polyvalents, ils sont employés dans de nombreux rôles, du compagnon familial au chien de garde en passant par le service militaire.',
    characteristics: {
      size: 'large',
      weight: { min: 22, max: 40 },
      height: { min: 55, max: 65 },
      temperament: ['confiant', 'courageux', 'intelligent', 'loyal'],
      activityLevel: 'very-high',
      lifeExpectancy: { min: 9, max: 13 }
    },
    origin: 'Allemagne',
    care: {
      grooming: 'Double pelage nécessitant un brossage régulier et une forte mue lors des changements de saison.',
      exercise: 'Besoins élevés en exercice - plus de 2 heures par jour. La stimulation mentale est importante.',
      diet: 'Croquettes de qualité, 350-450g par jour, formulées pour les grandes races actives.'
    },
    health: {
      commonIssues: ['Dysplasie de la hanche', 'Myélopathie dégénérative', 'Fistules périanales'],
      preventiveCare: 'Dépistage régulier, maintien du poids idéal, exercice et nutrition appropriés.'
    }
  },
  {
    name: 'Golden Retriever',
    description: 'Les Golden Retrievers sont des chiens remarquablement dévoués, intelligents et faciles à éduquer, avec un magnifique pelage doré. Grâce à leur nature douce et leur amour de l\'activité, ils font d\'excellents animaux de compagnie et excellent dans les rôles d\'assistance.',
    characteristics: {
      size: 'large',
      weight: { min: 25, max: 34 },
      height: { min: 51, max: 61 },
      temperament: ['amical', 'intelligent', 'dévoué', 'obéissant'],
      activityLevel: 'high',
      lifeExpectancy: { min: 10, max: 12 }
    },
    origin: 'Écosse',
    care: {
      grooming: 'Double pelage dense nécessitant un brossage quotidien et une tonte régulière.',
      exercise: 'Besoin de 1 à 2 heures d\'exercice quotidien incluant promenades, courses ou natation.',
      diet: 'Croquettes de qualité, 300-400g par jour, adaptées à l\'âge et au niveau d\'activité.'
    },
    health: {
      commonIssues: ['Dysplasie de la hanche', 'Dysplasie du coude', 'Cancer'],
      preventiveCare: 'Visites vétérinaires régulières, compléments articulaires, maintien d\'un poids sain.'
    }
  },
  {
    name: 'Bouledogue Français',
    description: 'Avec son esprit comique et ses adorables oreilles de chauve-souris, le Bouledogue Français est un charmant compagnon intelligent, alerte, joueur et absolument intrépide. Ce sont des chiens adaptables qui s\'épanouissent en environnement urbain.',
    characteristics: {
      size: 'small',
      weight: { min: 8, max: 14 },
      height: { min: 28, max: 33 },
      temperament: ['alerte', 'joueur', 'intelligent', 'affectueux'],
      activityLevel: 'moderate',
      lifeExpectancy: { min: 10, max: 12 }
    },
    origin: 'France',
    care: {
      grooming: 'Pelage court nécessitant peu d\'entretien, mais les plis du visage doivent être nettoyés régulièrement.',
      exercise: 'Besoins modérés en exercice - promenades quotidiennes et temps de jeu suffisants.',
      diet: '150-200g de croquettes de qualité par jour, surveiller l\'obésité.'
    },
    health: {
      commonIssues: ['Syndrome brachycéphale', 'Problèmes oculaires', 'Problèmes cutanés'],
      preventiveCare: 'Garder au frais en été, nettoyage régulier des oreilles, soins dentaires.'
    }
  },
  {
    name: 'Beagle',
    description: 'Les Beagles sont de joyeux petits chasseurs, au bonheur lorsqu\'ils suivent une piste à travers champs. Ce sont des chiens de meute qui créent des liens forts avec leur famille et sont connus pour leur tempérament attachant et leur aboiement distinctif.',
    characteristics: {
      size: 'small',
      weight: { min: 9, max: 15 },
      height: { min: 33, max: 40 },
      temperament: ['curieux', 'joyeux', 'indépendant', 'sociable'],
      activityLevel: 'high',
      lifeExpectancy: { min: 12, max: 15 }
    },
    origin: 'Angleterre',
    care: {
      grooming: 'Pelage court nécessitant un brossage régulier et des bains occasionnels.',
      exercise: 'Besoins élevés en exercice - 1 à 2 heures par jour pour dépenser leur énergie.',
      diet: '150-200g de croquettes de qualité par jour, surveiller la prise de poids.'
    },
    health: {
      commonIssues: ['Infections auriculaires', 'Hypothyroïdie', 'Épilepsie'],
      preventiveCare: 'Nettoyage régulier des oreilles, surveillance thyroïdienne, soins dentaires.'
    }
  }
]

async function seedDatabase() {
  try {
    await connectDB()

    // Vider le cache de race existante
    await Breed.deleteMany({})
    console.log('Races existantes supprimées')

    // Insertion des races
    const insertedBreeds = await Breed.insertMany(breedsData)
    console.log(`${insertedBreeds.length} races ajoutées avec succès`)

    // Affiche l'insertion des races
    console.log('\nRaces ajoutées :')
    insertedBreeds.forEach(breed => {
      console.log(`  - ${breed.name} (${breed.characteristics.size})`)
    })

    console.log('\n✓ Dbb complétée avec succès')
    process.exit(0)
  } catch (error) {
    console.error('Erreur d\'envoi de la bdd de races', error.message)
    process.exit(1)
  }
}

seedDatabase()
