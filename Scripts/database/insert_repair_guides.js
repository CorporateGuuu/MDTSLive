import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample repair guides data
const sampleGuides = [
  {
    title: 'iPhone 16 Pro Max Screen Replacement Guide',
    slug: 'iphone-16-pro-max-screen-replacement',
    description: 'Complete step-by-step guide to replace the MidasGold 7.0 OLED screen on iPhone 16 Pro Max. Professional repair instructions with video walkthrough.',
    device: 'iPhone 16 Pro Max',
    difficulty: 'Medium',
    estimated_time: '45-60 minutes',
    tools_needed: [
      'Precision Screwdriver Set',
      'Heat Gun for Repairs',
      'Opening Tools & Pry Bars',
      'Adhesive & Glue Guns',
      'Anti-Static Protection',
      'Cleaning Supplies'
    ],
    parts_needed: [
      'MidasGold 7.0 OLED Screen for iPhone 16 Pro Max',
      'MidasGold 7.0 Adhesive Kit',
      'Precision Screwdriver Set'
    ],
    featured_image: '/images/guides/iphone-16-screen-replacement.jpg',
    is_published: true,
    steps: [
      {
        step_number: 1,
        title: 'Power Off and Prepare',
        description: 'Power off your iPhone completely and remove any screen protector or case. Ensure you have a clean, static-free workspace.'
      },
      {
        step_number: 2,
        title: 'Remove Bottom Screws',
        description: 'Use the precision screwdriver to remove the two pentalobe screws at the bottom of the iPhone. Place screws in a magnetic organizer.'
      },
      {
        step_number: 3,
        title: 'Heat the Screen',
        description: 'Apply heat evenly around the screen edges using the heat gun. Heat for 2-3 minutes to soften the adhesive. Be careful not to overheat.'
      },
      {
        step_number: 4,
        title: 'Separate the Screen',
        description: 'Insert opening tools and carefully pry the screen away from the frame. Work slowly around all edges to avoid damage.'
      },
      {
        step_number: 5,
        title: 'Disconnect Cables',
        description: 'Carefully disconnect the display cables and home button cable. Note the positions for reassembly.'
      },
      {
        step_number: 6,
        title: 'Remove Old Adhesive',
        description: 'Clean off the old adhesive residue from both the frame and screen using adhesive remover. Ensure surfaces are completely clean.'
      },
      {
        step_number: 7,
        title: 'Apply New Adhesive',
        description: 'Apply the MidasGold adhesive strips around the frame perimeter. Remove backing paper and position carefully.'
      },
      {
        step_number: 8,
        title: 'Connect New Screen',
        description: 'Connect all display cables to the new MidasGold OLED screen. Ensure proper alignment and secure connections.'
      },
      {
        step_number: 9,
        title: 'Reassemble Device',
        description: 'Carefully place the new screen onto the frame. Apply even pressure around the edges to ensure proper adhesion.'
      },
      {
        step_number: 10,
        title: 'Power On and Test',
        description: 'Power on the iPhone and test all functions including touch, display, Face ID, and cameras. Run diagnostics if available.'
      }
    ]
  },
  {
    title: 'Samsung Galaxy S25 Battery Replacement',
    slug: 'samsung-galaxy-s25-battery-replacement',
    description: 'Professional guide to safely replace the battery in Samsung Galaxy S25. Includes safety precautions and testing procedures.',
    device: 'Samsung Galaxy S25',
    difficulty: 'Easy',
    estimated_time: '25-35 minutes',
    tools_needed: [
      'Precision Screwdriver Set',
      'Opening Tools & Pry Bars',
      'Anti-Static Protection',
      'Cleaning Supplies'
    ],
    parts_needed: [
      'MidasPower Battery for Samsung Galaxy S25',
      'Precision Screwdriver Set'
    ],
    featured_image: '/images/guides/samsung-s25-battery.jpg',
    is_published: true,
    steps: [
      {
        step_number: 1,
        title: 'Safety First',
        description: 'Power off your Samsung Galaxy S25. Wear anti-static protection and work in a clean, dry environment.'
      },
      {
        step_number: 2,
        title: 'Remove Back Cover',
        description: 'Use the heat gun to soften the adhesive, then use opening tools to pry off the back glass cover.'
      },
      {
        step_number: 3,
        title: 'Disconnect Battery',
        description: 'Locate and carefully disconnect the battery connector. This is critical for safety during the repair.'
      },
      {
        step_number: 4,
        title: 'Remove Old Battery',
        description: 'Carefully peel back the adhesive strips and remove the old battery. Dispose of properly according to local regulations.'
      },
      {
        step_number: 5,
        title: 'Install New Battery',
        description: 'Apply adhesive strips to the new MidasPower battery and position it correctly in the phone.'
      },
      {
        step_number: 6,
        title: 'Reconnect Battery',
        description: 'Carefully reconnect the battery cable and ensure it is securely fastened.'
      },
      {
        step_number: 7,
        title: 'Reassemble Device',
        description: 'Replace the back cover and secure it with new adhesive if needed.'
      },
      {
        step_number: 8,
        title: 'Power On and Calibrate',
        description: 'Power on the device and allow the battery to calibrate. Check battery health in settings.'
      }
    ]
  },
  {
    title: 'iPad Pro 12.9" LCD Assembly Replacement',
    slug: 'ipad-pro-12-9-lcd-assembly-replacement',
    description: 'Complete guide for replacing the LCD assembly in iPad Pro 12.9". Professional repair with video support.',
    device: 'iPad Pro 12.9"',
    difficulty: 'Hard',
    estimated_time: '60-90 minutes',
    tools_needed: [
      'Precision Screwdriver Set',
      'Heat Gun for Repairs',
      'Opening Tools & Pry Bars',
      'Soldering Equipment',
      'Anti-Static Protection',
      'Cleaning Supplies'
    ],
    parts_needed: [
      'iPad Pro 12.9" LCD Assembly',
      'MidasGold Adhesive Kit',
      'Precision Screwdriver Set'
    ],
    featured_image: '/images/guides/ipad-pro-lcd.jpg',
    is_published: true,
    steps: [
      {
        step_number: 1,
        title: 'Preparation',
        description: 'Power off the iPad completely. Gather all tools and work in a clean, well-lit area with proper ventilation.'
      },
      {
        step_number: 2,
        title: 'Remove Screen',
        description: 'Heat the screen edges and carefully separate the LCD assembly from the frame using opening tools.'
      },
      {
        step_number: 3,
        title: 'Disconnect Components',
        description: 'Carefully disconnect all ribbon cables, digitizer connections, and any soldered components.'
      },
      {
        step_number: 4,
        title: 'Remove LCD Assembly',
        description: 'Once all connections are freed, gently lift out the old LCD assembly and set aside.'
      },
      {
        step_number: 5,
        title: 'Prepare New Assembly',
        description: 'Inspect the new LCD assembly and ensure all connectors are properly positioned.'
      },
      {
        step_number: 6,
        title: 'Reconnect Components',
        description: 'Carefully reconnect all ribbon cables and digitizer connections to the new LCD assembly.'
      },
      {
        step_number: 7,
        title: 'Apply Adhesive',
        description: 'Apply MidasGold adhesive around the frame perimeter for secure bonding.'
      },
      {
        step_number: 8,
        title: 'Reassemble Device',
        description: 'Carefully position the new LCD assembly and apply even pressure around all edges.'
      },
      {
        step_number: 9,
        title: 'Test Functionality',
        description: 'Power on the iPad and test touch sensitivity, display quality, and all functions.'
      },
      {
        step_number: 10,
        title: 'Calibration',
        description: 'Allow the device to calibrate and run any available diagnostic tests to ensure proper function.'
      }
    ]
  },
  {
    title: 'MacBook Pro Keyboard Replacement',
    slug: 'macbook-pro-keyboard-replacement',
    description: 'Professional guide to replace the keyboard assembly in MacBook Pro models. Includes battery safety and testing.',
    device: 'MacBook Pro',
    difficulty: 'Hard',
    estimated_time: '75-120 minutes',
    tools_needed: [
      'Precision Screwdriver Set',
      'Opening Tools & Pry Bars',
      'Soldering Equipment',
      'Heat Gun for Repairs',
      'Anti-Static Protection',
      'Cleaning Supplies'
    ],
    parts_needed: [
      'MacBook Pro Keyboard Assembly',
      'Precision Screwdriver Set'
    ],
    featured_image: '/images/guides/macbook-keyboard.jpg',
    is_published: true,
    steps: [
      {
        step_number: 1,
        title: 'Backup and Preparation',
        description: 'Back up all data and power off the MacBook. Ensure you have proper anti-static protection.'
      },
      {
        step_number: 2,
        title: 'Remove Bottom Case',
        description: 'Flip the MacBook over and remove all bottom screws using the precision screwdriver set.'
      },
      {
        step_number: 3,
        title: 'Disconnect Battery',
        description: 'Locate and carefully disconnect the battery connector to prevent electrical hazards.'
      },
      {
        step_number: 4,
        title: 'Remove Keyboard Assembly',
        description: 'Carefully disconnect ribbon cables and remove the old keyboard assembly from the chassis.'
      },
      {
        step_number: 5,
        title: 'Clean Contact Points',
        description: 'Clean all contact points and connection areas to ensure proper function of the new keyboard.'
      },
      {
        step_number: 6,
        title: 'Install New Keyboard',
        description: 'Position the new keyboard assembly and reconnect all ribbon cables securely.'
      },
      {
        step_number: 7,
        title: 'Reconnect Battery',
        description: 'Carefully reconnect the battery connector and ensure it is properly seated.'
      },
      {
        step_number: 8,
        title: 'Reassemble Device',
        description: 'Replace the bottom case and secure all screws in the correct order.'
      },
      {
        step_number: 9,
        title: 'Power On and Test',
        description: 'Power on the MacBook and test all keyboard functions, shortcuts, and backlight.'
      },
      {
        step_number: 10,
        title: 'Software Updates',
        description: 'Check for and install any required software updates or keyboard firmware updates.'
      }
    ]
  },
  {
    title: 'Pixel 9 Camera Module Replacement',
    slug: 'pixel-9-camera-module-replacement',
    description: 'Complete guide for replacing the camera module in Google Pixel 9. Includes calibration and testing procedures.',
    device: 'Google Pixel 9',
    difficulty: 'Medium',
    estimated_time: '40-55 minutes',
    tools_needed: [
      'Precision Screwdriver Set',
      'Opening Tools & Pry Bars',
      'Heat Gun for Repairs',
      'Anti-Static Protection',
      'Cleaning Supplies'
    ],
    parts_needed: [
      'Pixel 9 Camera Module',
      'Precision Screwdriver Set'
    ],
    featured_image: '/images/guides/pixel-9-camera.jpg',
    is_published: true,
    steps: [
      {
        step_number: 1,
        title: 'Safety Precautions',
        description: 'Power off the Pixel 9 and remove SIM card. Work in a clean environment with anti-static protection.'
      },
      {
        step_number: 2,
        title: 'Heat and Separate',
        description: 'Apply heat to soften adhesive, then use opening tools to separate the back glass panel.'
      },
      {
        step_number: 3,
        title: 'Access Mainboard',
        description: 'Carefully disconnect the battery and locate the camera module on the mainboard.'
      },
      {
        step_number: 4,
        title: 'Remove Old Camera',
        description: 'Unscrew and carefully disconnect the camera module from its connectors.'
      },
      {
        step_number: 5,
        title: 'Install New Camera',
        description: 'Position the new camera module and secure all connectors and screws.'
      },
      {
        step_number: 6,
        title: 'Reconnect Battery',
        description: 'Carefully reconnect the battery and ensure all other connections are secure.'
      },
      {
        step_number: 7,
        title: 'Reassemble Device',
        description: 'Replace the back glass panel and apply new adhesive if needed.'
      },
      {
        step_number: 8,
        title: 'Power On and Test',
        description: 'Test camera functionality, image quality, and all camera modes (photo, video, portrait).'
      },
      {
        step_number: 9,
        title: 'Calibration',
        description: 'Run camera calibration in settings and test Night Sight, HDR+, and other Google Camera features.'
      }
    ]
  }
];

async function insertRepairGuides() {
  try {
    console.log('Starting repair guides insertion...');

    for (const guide of sampleGuides) {
      console.log(`\n📖 Creating guide: ${guide.title}`);

      // Insert the guide using Supabase client
      const { data: guideData, error: guideError } = await supabase
        .from('repair_guides')
        .insert({
          title: guide.title,
          slug: guide.slug,
          description: guide.description,
          device: guide.device,
          difficulty: guide.difficulty,
          estimated_time: guide.estimated_time,
          tools_needed: guide.tools_needed,
          parts_needed: guide.parts_needed,
          featured_image: guide.featured_image,
          is_published: guide.is_published
        })
        .select('id')
        .single();

      if (guideError) {
        console.error(`❌ Error creating guide ${guide.title}:`, guideError);
        continue;
      }

      console.log(`✅ Created guide with ID: ${guideData.id}`);

      // Insert guide steps
      console.log(`📝 Adding ${guide.steps.length} steps...`);
      for (const step of guide.steps) {
        const { error: stepError } = await supabase
          .from('guide_steps')
          .insert({
            guide_id: guideData.id,
            step_number: step.step_number,
            title: step.title,
            description: step.description,
            image_url: step.image_url,
            video_url: step.video_url
          });

        if (stepError) {
          console.error(`❌ Error adding step ${step.step_number}:`, stepError);
        }
      }

      // Add sample video for each guide
      const { error: videoError } = await supabase
        .from('guide_videos')
        .insert({
          guide_id: guideData.id,
          title: `${guide.title} - Full Tutorial`,
          description: `Complete video tutorial for ${guide.title}`,
          youtube_url: `https://www.youtube.com/watch?v=${guide.slug.replace(/-/g, '')}Tutorial`,
          thumbnail_url: guide.featured_image,
          duration: 'PT15M30S'
        });

      if (videoError) {
        console.error(`❌ Error adding video for ${guide.title}:`, videoError);
      } else {
        console.log(`🎥 Added video for ${guide.title}`);
      }
    }

    console.log('\n🎉 Repair guides insertion completed!');

    // Verify the insertion
    const { data: guides, error: verifyError } = await supabase
      .from('repair_guides')
      .select('title, is_published')
      .eq('is_published', true);

    if (verifyError) {
      console.error('❌ Error verifying guides:', verifyError);
    } else {
      console.log(`\n📊 Verification: ${guides?.length || 0} published guides found`);
      guides?.forEach(guide => console.log(`   ✓ ${guide.title}`));
    }

  } catch (error) {
    console.error('Error in repair guides insertion process:', error);
    process.exit(1);
  }
}

// Run the insertion
insertRepairGuides();
