-- Inserir eventos de teste
INSERT INTO calendar_events 
(title, description, start_time, end_time, meet_link, created_by)
VALUES
-- Evento para hoje
(
    'Reunião de Planejamento',
    'Discussão sobre as metas do próximo trimestre',
    CURRENT_DATE + INTERVAL '2 hours',
    CURRENT_DATE + INTERVAL '3 hours',
    'https://meet.google.com/abc-defg-hij',
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para amanhã
(
    'Apresentação do Projeto',
    'Apresentação do progresso do projeto para o cliente',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours',
    'https://meet.google.com/xyz-uvwx-rst',
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para depois de amanhã
(
    'Treinamento da Equipe',
    'Sessão de treinamento sobre as novas funcionalidades',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours',
    NULL,
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para próxima semana
(
    'Review Mensal',
    'Revisão dos resultados do mês',
    CURRENT_DATE + INTERVAL '5 days' + INTERVAL '9 hours',
    CURRENT_DATE + INTERVAL '5 days' + INTERVAL '10 hours',
    'https://meet.google.com/123-456-789',
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para daqui a duas semanas
(
    'Workshop de Inovação',
    'Workshop sobre novas tecnologias e tendências',
    CURRENT_DATE + INTERVAL '14 days' + INTERVAL '13 hours',
    CURRENT_DATE + INTERVAL '14 days' + INTERVAL '17 hours',
    NULL,
    '00000000-0000-0000-0000-000000000000'
);