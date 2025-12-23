/**
 * One-time script to update T-Mobile icon URL to use local SVG
 * Run with: node scripts/update-tmobile-icon.js
 * 
 * Make sure your .env.local file has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

const fs = require('fs');
const path = require('path');

// Try to load .env.local manually if dotenv is not available
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  // Ignore errors, just use process.env as-is
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function updateTmobileIcon() {
  try {
    // First, find the T-Mobile entry
    const { data: experiences, error: fetchError } = await supabase
      .from('experience')
      .select('id, name, icon_url')
      .ilike('name', '%T-Mobile%');

    if (fetchError) {
      console.error('Error fetching experience:', fetchError);
      return;
    }

    if (!experiences || experiences.length === 0) {
      console.log('No T-Mobile entry found in experience table.');
      console.log('You may need to update it manually through the admin panel.');
      return;
    }

    console.log(`Found ${experiences.length} T-Mobile entry(ies):`);
    experiences.forEach(exp => {
      console.log(`  - ID: ${exp.id}, Name: ${exp.name}, Current icon: ${exp.icon_url || '(none)'}`);
    });

    // Update all T-Mobile entries
    for (const exp of experiences) {
      const { error: updateError } = await supabase
        .from('experience')
        .update({ icon_url: '/deutschetelekom.svg' })
        .eq('id', exp.id);

      if (updateError) {
        console.error(`Error updating ${exp.name} (ID: ${exp.id}):`, updateError);
      } else {
        console.log(`✓ Successfully updated ${exp.name} (ID: ${exp.id}) to use /deutschetelekom.svg`);
      }
    }

    console.log('\nDone! The T-Mobile icon should now use the local SVG file.');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateTmobileIcon();

