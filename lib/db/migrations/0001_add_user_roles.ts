import { sql } from 'drizzle-orm';
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export async function up(db: any) {
  // First, update existing users with 'member' role to 'user' role
  await db.execute(sql`
    UPDATE users 
    SET role = 'user' 
    WHERE role = 'member' AND id NOT IN (
      SELECT DISTINCT user_id 
      FROM team_members
    )
  `);

  // Update users who are team members to have 'member' role
  await db.execute(sql`
    UPDATE users 
    SET role = 'member' 
    WHERE id IN (
      SELECT DISTINCT user_id 
      FROM team_members 
      WHERE role = 'member'
    )
  `);

  // Update users who are team owners to have 'owner' role
  await db.execute(sql`
    UPDATE users 
    SET role = 'owner' 
    WHERE id IN (
      SELECT DISTINCT user_id 
      FROM team_members 
      WHERE role = 'owner'
    )
  `);
}

export async function down(db: any) {
  // Revert all users back to 'member' role
  await db.execute(sql`
    UPDATE users 
    SET role = 'member'
  `);
} 