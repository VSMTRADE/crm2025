-- Atualizar os eventos removendo os links fictícios
UPDATE calendar_events 
SET meet_link = NULL;

-- Inserir novos eventos sem links (você adicionará os links reais quando criar as reuniões no Google Calendar)
DELETE FROM calendar_events;

INSERT INTO calendar_events 
(title, description, start_time, end_time, created_by)
VALUES
-- Evento para hoje
(
    'Reunião de Planejamento',
    'Discussão sobre as metas do próximo trimestre',
    CURRENT_DATE + INTERVAL '2 hours',
    CURRENT_DATE + INTERVAL '3 hours',
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para amanhã
(
    'Apresentação do Projeto',
    'Apresentação do progresso do projeto para o cliente',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours',
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para depois de amanhã
(
    'Treinamento da Equipe',
    'Sessão de treinamento sobre as novas funcionalidades',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours',
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para próxima semana
(
    'Review Mensal',
    'Revisão dos resultados do mês',
    CURRENT_DATE + INTERVAL '5 days' + INTERVAL '9 hours',
    CURRENT_DATE + INTERVAL '5 days' + INTERVAL '10 hours',
    '00000000-0000-0000-0000-000000000000'
),
-- Evento para daqui a duas semanas
(
    'Workshop de Inovação',
    'Workshop sobre novas tecnologias e tendências',
    CURRENT_DATE + INTERVAL '14 days' + INTERVAL '13 hours',
    CURRENT_DATE + INTERVAL '14 days' + INTERVAL '17 hours',
    '00000000-0000-0000-0000-000000000000'
);
