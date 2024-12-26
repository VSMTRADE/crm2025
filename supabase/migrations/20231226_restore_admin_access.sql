-- Restore admin access for specific email
INSERT INTO auth.users (email, role)
VALUES ('wanderson.m.silva@pbh.gov.br', 'admin')
ON CONFLICT (email) 
DO UPDATE SET role = 'admin'
WHERE auth.users.email = 'wanderson.m.silva@pbh.gov.br';

-- Ensure admin policies are in place
CREATE POLICY "Admin Access"
ON public.tasks
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'wanderson.m.silva@pbh.gov.br'
  OR
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE users.email = auth.jwt() ->> 'email'
    AND users.role = 'admin'
  )
);
