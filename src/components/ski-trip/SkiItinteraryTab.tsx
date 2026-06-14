import React, { Component } from 'react';

// Define strict TypeScript interfaces for our data structure
interface OperationalRule {
  title: string;
  description: string;
}

interface ItineraryStep {
  time: string;
  title: string;
  description: React.ReactNode; // Allows passing JSX/formatted text directly
}

interface DailyItinerary {
  dayNum: number;
  dayName: string;
  title: string;
  focus: string;
  schedule: ItineraryStep[];
}

class SkiItineraryTab extends Component {
  // Core operational strategy rules array
  private coreStrategies: OperationalRule[] = [
    {
      title: "The January Sun Matrix",
      description: "January brings low sun angles and deep alpine cold. This routing targets east-facing aspects in the morning to maximize sunlight and transitions to high western shelves as the afternoon develops."
    },
    {
      title: "First-Track Prioritization",
      description: "Wide, high-profile World Cup and Glacier highways are placed as the first runs of the morning to capture fresh overnight corduroy."
    },
    {
      title: "Logistical Boundaries",
      description: "All daily routes finish with high-altitude ridge crossings no later than 3:00 PM to prevent getting caught on the wrong side of the valley during 4:00 PM lift closures."
    },
    {
      title: "Daily Operational Cadence",
      description: "Boots on snow for 09:00 AM lift openings. Coffee break around 10:30 AM. Early lunch bookings at 11:30 AM or 12:00 PM to bypass peak mountain crowd flows."
    }
  ];

  // Helper method to wrap piste names in stylized, color-coded markers
  private renderPiste = (name: string, type: 'blue' | 'red') => {
    const baseClass = "font-semibold px-1 rounded inline-block";
    const colorClass = type === 'blue' 
      ? "text-blue-600 bg-blue-50 border border-blue-100" 
      : "text-red-600 bg-red-50 border border-red-100";
    return <span className={`${baseClass} ${colorClass}`}>{name} ({type === 'blue' ? 'Blue' : 'Red'})</span>;
  };

  // Structured itinerary data map
  private itineraries: DailyItinerary[] = [
    {
      dayNum: 1,
      dayName: "Sunday, January 3",
      title: "The Grande Motte Glacier Highway",
      focus: "Opening up ski legs on massive high-altitude vertical terrain with premium snow quality and wide carving profiles.",
      schedule: [
        {
          time: "09:00 AM",
          title: "First Lifts & Ascent",
          description: <>Take the high-speed <strong>Grande Motte Funicular</strong> from Val Claret up to 3,032m. Immediately transfer to the <strong>Grande Motte Cable Car</strong> to reach the highest lift-served point at 3,456m.</>
        },
        {
          time: "Morning",
          title: "Piste Sequence",
          description: <>Warm up on the upper glacier shelf via the wide, rolling {this.renderPiste("Glacier", "blue")} and {this.renderPiste("Rimaye", "blue")} loops. Dive directly onto {this.renderPiste("Double M", "red")}, a sprawling 1,300m vertical cruising highway tracking all the way back into Val Claret with consistent pitches and immense visibility.</>
        },
        {
          time: "10:30 AM",
          title: "☕ Coffee Break",
          description: <><strong>Le Panoramic</strong> (Top of the funicular station). Grab an outdoor table by the terrace heaters or warm up inside the mountain-chic refuge with a double espresso and fresh pastry while looking up at the frozen glacier ice fields.</>
        },
        {
          time: "11:00 AM",
          title: "Late Morning Loops",
          description: <>Ride the fast <strong>Lanches</strong> quad chairlift. Execute wide GS carving turns on the wide-open rolling faces of the {this.renderPiste("Lanches", "red")} piste and the smooth banks of the lower {this.renderPiste("Carline", "blue")}.</>
        },
        {
          time: "12:00 PM",
          title: "🍽️ Early Lunch",
          description: <><strong>Restaurant Les Terrasses</strong> (Val Claret snow-front). Secure a table on the sprawling sun terrace. Signature dishes include braised meats, house-made burgers, or truffle-infused mountain pastas.</>
        },
        {
          time: "Afternoon",
          title: "Cruising Finale",
          description: <>Ride the <strong>Bollin</strong> and <strong>Fresse</strong> express chairlifts. Lap the sunny, gentle terrain on the border of the Tignes bowl, riding the undulating {this.renderPiste("Bollin", "blue")} and {this.renderPiste("Fresse", "blue")} pistes until the early January shadow hits the resort floor.</>
        }
      ]
    },
    {
      dayNum: 2,
      dayName: "Monday, January 4",
      title: "L'Aiguille Percée Tree-Lined Pilgrimage",
      focus: "Navigating long, winding cruisers from high geological peaks down into sheltered, tree-lined traditional valley villages.",
      schedule: [
        {
          time: "09:00 AM",
          title: "First Lifts & Cross-Bowl Transit",
          description: <>Board the <strong>Tichot</strong> express out of Val Claret, link into the <strong>Grattalu</strong> detachable chair, and fly down the wide, open {this.renderPiste("Grattalu", "blue")} slope. Cross the Le Lac valley floor to board the high-speed <strong>Palafour</strong> chairlift, transferring directly to the <strong>Aiguille Percée</strong> chairlift to arrive beside the famous natural "Eye of the Needle" rock structure.</>
        },
        {
          time: "10:30 AM",
          title: "☕ Coffee Break",
          description: <><strong>Lo Soli</strong> (Top of the Percée massif). A traditional stone-and-wood alpine chalet sitting right on the ridge line. Step inside its timber interior for a hot chocolate or cappuccino alongside a blazing log fireplace.</>
        },
        {
          time: "11:00 AM",
          title: "The Long Descent",
          description: <><span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Bypass the brutal, mogul-filled La Sache black run completely.</span> Point skis down the panoramic, sweeping {this.renderPiste("Silène", "red")} which turns beautifully into the winding, forested {this.renderPiste("Bleuet", "blue")}. This massive route wraps around the mountain flank for kilometers before sliding gently into the trees.</>
        },
        {
          time: "11:30 AM",
          title: "🍽️ Early Lunch",
          description: <><strong>La Ferme des 3 Capucines</strong> (Lavachet sector). An authentic working farm conversion. Indulge in elite-tier farm-to-fork Savoyard dining, featuring home-produced Reblochon cheeses, traditional Fondue, or rich Tartiflette.</>
        },
        {
          time: "Afternoon",
          title: "Cruising System",
          description: <>Use the <strong>Chaudannes</strong> express chair to ascend out of the valley base. Spend a relaxed afternoon lapping the highly scenic, sun-drenched intermediate bowls via the winding {this.renderPiste("Corniche", "blue")} and the wide, open carving lines of {this.renderPiste("Rhododendron", "red")}, sliding back down to Val Claret via the lower connector trails.</>
        }
      ]
    },
    {
      dayNum: 3,
      dayName: "Tuesday, January 5",
      title: "The Val d'Isère Boundary & World Cup Turf",
      focus: "Crossing the mountain pass to explore the rolling terrain, wide racing tracks, and historic valleys of Val d'Isère.",
      schedule: [
        {
          time: "09:00 AM",
          title: "First Lifts & Sector Crossing",
          description: <>Catch the high-capacity <strong>Tufs</strong> or <strong>Tovière</strong> gondola straight out of Val Claret to the 2,704m Tovière crest line. Cross over the ridge line into the Val d'Isère domain via the long, beautifully prepared {this.renderPiste("Diebold", "blue")} carving run.</>
        },
        {
          time: "Morning",
          title: "Piste Sequence",
          description: <>Transition directly onto the historic {this.renderPiste("OK", "red")} run—a world-renowned Alpine Ski World Cup downhill course. Because it avoids extreme vertical cliffs, it serves as a spectacular, ultra-wide, high-speed cruiser that lets you hold deep edges for miles without severe pitches.</>
        },
        {
          time: "10:30 AM",
          title: "☕ Coffee Break",
          description: <>Reach the absolute base of the mountain at La Daille. Pop into a slope-side terrace bar right next to the funicular station for a rapid Italian-style espresso or macchiato to recharge your core temperature.</>
        },
        {
          time: "11:00 AM",
          title: "Late Morning Loops",
          description: <>Step straight into the high-speed <strong>Funival</strong> underground mountain railway or the <strong>Symphonie</strong> gondola. Ascend back up to the Bellevarde plateau and map out long, rolling laps down the winding {this.renderPiste("Verte", "blue")} and the wide, undulating, sunny stretches of the {this.renderPiste("Rayes", "red")} piste.</>
        },
        {
          time: "12:00 PM",
          title: "🍽️ Early Lunch",
          description: <><strong>Le Trifollet</strong> (Perched just above La Daille along the edge of the runs). A traditional alpine chalet structure famous for its wood-fired pizzas, rich duck breast, or classic, steaming pot-au-feu.</>
        },
        {
          time: "Afternoon",
          title: "Cruising Connection",
          description: <>Take the <strong>Mont Blanc</strong> or <strong>Borsat</strong> express chairs up to the border ridge. Spend your afternoon mapping out wide, sweeping lines across the high, snow-sure intermediate plateaus of the {this.renderPiste("Borsat", "blue")} lanes, tracking your way back over the Tovière ridge into Tignes before the lifts close.</>
        }
      ]
    },
    {
      dayNum: 4,
      dayName: "Wednesday, January 6",
      title: "The Le Fornet Frontier & Pissaillas Glacier",
      focus: "A grand expedition to the absolute furthest geographic boundary of the trail map to ride empty, snow-sure high glacier cruisers.",
      schedule: [
        {
          time: "09:00 AM",
          title: "Long Range Transit",
          description: <>Take the <strong>Fresse</strong> or <strong>Tufs</strong> chair out of Val Claret, cruise down through Val d'Isère center, and ride the high-speed <strong>Solaise Express</strong>. Ski down the easy <strong>Marmottes</strong> link to catch the <strong>Fornet Cable Car</strong> followed by the <strong>Vallon</strong> gondola to arrive at the remote <strong>Pissaillas Glacier</strong>.</>
        },
        {
          time: "Morning",
          title: "Piste Sequence",
          description: <>Enjoy the highest-quality, dry winter snow on the wide-open, empty highways of {this.renderPiste("Moraine", "blue")} and {this.renderPiste("Pissaillas", "blue")}. These slopes feature zero crowds and immense widths, offering perfect conditions for clean, high-speed alpine carving.</>
        },
        {
          time: "10:30 AM",
          title: "☕ Coffee Break",
          description: <><strong>La Cascade</strong> (Foot of the glacier lift system). A high-altitude mountain refuge perfect for a warm tea or café au lait on the deck while taking in the wild, rugged views of the border peaks.</>
        },
        {
          time: "11:00 AM",
          title: "The Grand Valley Loop",
          description: <>Push off into the majestic, kilometers-long {this.renderPiste("Mangard", "blue")} trail. This scenic, uninterrupted cruiser wraps seamlessly around the high mountainside before winding through alpine trees all the way to the old-world stone hamlet of Le Fornet.</>
        },
        {
          time: "11:30 AM",
          title: "🍽️ Early Lunch",
          description: <><strong>L'Edelweiss</strong> (Located directly alongside the forested lower section of the Mangard run). A highly acclaimed, romantic log-cabin restaurant serving refined, upscale gastronomy. Indulge in slow-cooked duck confit, fresh chanterelle pasta, or exquisite house desserts next to an open fire.</>
        },
        {
          time: "Afternoon",
          title: "Cruising Return",
          description: <>Begin the multi-lift journey back across the domain. Take the Le Fornet gondolas back up, and spend your afternoon lazily linking the wide, scenic intermediate slopes of the {this.renderPiste("Plan", "blue")} and {this.renderPiste("Madeleine", "blue")} bowls on Solaise, ensuring you cross back over the Tignes boundary ridge well before the 04:00 PM lift closures.</>
        }
      ]
    },
    {
      dayNum: 5,
      dayName: "Thursday, January 7",
      title: "The Solaise Sun Bowls & Cabaret Feast",
      focus: "Blending vast, sunny intermediate bowls with world-class open-air mountain entertainment and premium culinary art.",
      schedule: [
        {
          time: "09:00 AM",
          title: "First Lifts & Solaise Entry",
          description: <>Take the fast <strong>Fresse</strong> detachable chairlift straight up from the Val Claret base area. Drop over the southeastern ridge line directly into the wide, sun-drenched Solaise bowl, which catches beautiful, warm morning rays in January.</>
        },
        {
          time: "Morning",
          title: "Piste Sequence",
          description: <>Lap the fast, sweeping, confidence-boosting lines of the {this.renderPiste("Mattis", "red")} and the wide, open, rolling terrain of the {this.renderPiste("Plan", "blue")} and {this.renderPiste("Solaise", "blue")} highways. The snow here is wide and beautifully ironed out by morning grooming.</>
        },
        {
          time: "10:30 AM",
          title: "☕ Coffee Break",
          description: <><strong>Solaise Lounge</strong> (Top of the main Solaise gondola axis). A state-of-the-art, fully glass-fronted indoor sanctuary featuring indoor coffee bars, deeply comfortable seating, and a warm, wind-free environment to enjoy a premium flat white or latte.</>
        },
        {
          time: "11:00 AM",
          title: "Late Morning Warm-Up",
          description: <>Ride the high-speed <strong>Marmottes</strong> six-pack chairlift to cross back toward the central ridge above La Daille, lapping the wide, rolling {this.renderPiste("Trifollet", "red")} approach lanes.</>
        },
        {
          time: "12:00 PM",
          title: "🍽️ Fine Dining & Show",
          description: <><strong>La Fruitière / La Folie Douce</strong> (La Daille mid-station). Enjoy world-class, upscale French culinary execution inside an elegant dairy-farm-styled interior. As your meal finishes, step right out onto the VIP deck as the legendary, high-energy live outdoor musical cabaret and DJ show kicks off across the snow courtyard.</>
        },
        {
          time: "Afternoon",
          title: "Cruising Security",
          description: <>Avoid the heavily used lower valley slopes by taking the high-speed ridge connections back toward Tignes. Enjoy a long, relaxed, sweeping journey back into the Tignes basin via the beautiful, rolling {this.renderPiste("Henri", "blue")} run, dropping down to Le Lac before connecting back to Val Claret.</>
        }
      ]
    },
    {
      dayNum: 6,
      dayName: "Friday, January 8",
      title: "The Palet Sun Bowls & Lakeside Finale",
      focus: "Re-visiting your favorite wide-open local carving spaces in the sunny Palet amphitheater and celebrating a finished week with an iconic lakeside cruise.",
      schedule: [
        {
          time: "09:00 AM",
          title: "First Lifts & Sun Hunting",
          description: <>Ride the <strong>Tichot</strong> express out of Val Claret to catch the very first morning sunbeams breaking over the spectacular Col du Palet sector.</>
        },
        {
          time: "Morning",
          title: "Piste Sequence",
          description: <>Spend a glorious, fast morning lapping the wide-open, undulating red terrain of {this.renderPiste("Anémone", "red")} and {this.renderPiste("Rhodos", "red")}. These runs feature excellent, rolling natural contours that let you carry smooth, effortless speed on crisp, uncrowded January corduroy.</>
        },
        {
          time: "10:30 AM",
          title: "☕ Coffee Break",
          description: <>Ski down to the vibrant snow-front of Tignes Le Lac. Secure an outdoor table at an alpine cafe right by the edge of the pistes to enjoy a hot coffee while looking across the expansive, frozen natural lake of Tignes.</>
        },
        {
          time: "11:00 AM",
          title: "The Grand Continuous Lap",
          description: <>Board the high-speed <strong>Grattalu</strong> chairlift to the top ridge. Link the peak directly into the upper {this.renderPiste("Grattalu", "blue")} run and seamlessly connect it straight into the long, winding, effortless cruiser trail {this.renderPiste("Carline", "blue")} for a massive, continuous top-to-bottom leg burner.</>
        },
        {
          time: "11:30 AM",
          title: "🍽️ Celebratory Final Lunch",
          description: <><strong>L'Escale Blanche</strong> (Tignes Le Lac). This premier slope-side restaurant features a massive, sun-drenched wooden patio. Celebrate your final day on the slopes with their incredible gourmet artisan pizzas, fresh flame-grilled burgers, or traditional pierrade platters.</>
        },
        {
          time: "Afternoon",
          title: "Grand Finale",
          description: <>Spend your final hours lapping the quiet, wide-open blue variants surrounding the <strong>Tichot</strong> chairlift, taking relaxed, playful runs before executing your final smooth descent right back to your accommodation door in Val Claret to conclude an epic week of skiing.</>
        }
      ]
    }
  ];

  render() {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gray-50 text-gray-800 antialiased p-2 md:p-6">
        
        {/* Header Hero Section */}
        <header className="bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6 md:p-8 rounded-xl shadow-md mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">🏔️ 6-Day Custom Ski Itinerary</h1>
          <p className="text-sm md:text-base text-gray-300 mb-6">Tignes &amp; Val d'Isère Premium Red &amp; Blue Piste Cruiser Guide</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700/60 text-xs md:text-sm">
            <div>
              <span className="block text-gray-400 font-medium uppercase tracking-wider text-[10px]">Trip Dates</span>
              <span className="font-medium">Jan 3, 2027 – Jan 8, 2027</span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium uppercase tracking-wider text-[10px]">Base Camp</span>
              <span className="font-medium">Tignes Val Claret (2,100m)</span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium uppercase tracking-wider text-[10px]">Ski Profile</span>
              <span className="font-medium">Strong Intermediate / Adv</span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium uppercase tracking-wider text-[10px]">Terrain Focus</span>
              <span className="font-medium text-blue-300">Strictly Red &amp; Blue Only</span>
            </div>
          </div>
        </header>

        {/* Mountain Strategy Block */}
        <section className="bg-white border-l-4 border-blue-600 rounded-r-xl shadow-sm p-5 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">🛡️ Core Mountain Strategy &amp; Rules</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {this.coreStrategies.map((strategy, idx) => (
              <li key={idx}>
                <strong className="text-slate-800">{strategy.title}:</strong> {strategy.description}
              </li>
            ))}
          </ul>
        </section>

        {/* Day-by-Day Loop */}
        <div className="space-y-8">
          {this.itineraries.map((day) => (
            <article key={day.dayNum} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              
              {/* Day Header */}
              <div className="bg-slate-50 border-b border-gray-200 px-5 py-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Day {day.dayNum}: {day.dayName} — {day.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 italic mt-1">
                  <strong>Strategic Focus:</strong> {day.focus}
                </p>
              </div>

              {/* Day Body with Vertical Progress Line Timeline */}
              <div className="p-5 md:p-6 space-y-6">
                {day.schedule.map((step, idx) => (
                  <div key={idx} className="relative pl-6 group">
                    
                    {/* Visual node separator decoration */}
                    <div className="absolute left-0 top-1.5 w-2.5 height h-2.5 rounded-full bg-blue-600 z-10" />
                    {idx !== day.schedule.length - 1 && (
                      <div className="absolute left-[4px] top-4 w-[2px] h-[calc(100%+1.5rem)] bg-gray-200" />
                    )}
                    
                    <div className="text-sm">
                      <span className="inline-block text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mb-1">
                        {step.time}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">{step.title}</h4>
                      <div className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </article>
          ))}
        </div>

      </div>
    );
  }
}

export default SkiItineraryTab;