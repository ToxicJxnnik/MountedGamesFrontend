<template>
  <div class="tournament-container">
    <Card>
      <template #title>
        <h1>Landesturnier OÖ</h1>
      </template>
      <template #content>
        <Accordion v-model:value="activeIndex" multiple>
          <!-- Runde 1 -->
          <AccordionPanel value="0">
            <AccordionHeader>Qualifikationsrunde 1</AccordionHeader>
            <AccordionContent>
              <Message severity="info" :closable="false"> Keine Heats vorhanden </Message>
            </AccordionContent>
          </AccordionPanel>

          <!-- Runde 2 -->
          <AccordionPanel value="1">
            <AccordionHeader>
              Qualifikationsrunde 2 - In Gang
              <Tag value="Live" severity="success" class="ml-2"></Tag>
            </AccordionHeader>
            <AccordionContent>
              <div class="heats-grid">
                <Card v-for="heat in heatsRound2" :key="heat.id" class="heat-card">
                  <template #title>
                    <div class="heat-title">
                      Heat {{ heat.id }}
                      <Tag
                        :value="heat.status"
                        :severity="getStatusSeverity(heat.status)"
                        class="ml-2"
                      ></Tag>
                    </div>
                  </template>
                  <template #content>
                    <DataTable :value="heat.participants" size="small">
                      <Column field="pos" header="Pos" style="width: 60px">
                        <template #body="slotProps"> {{ slotProps.data.pos }}. </template>
                      </Column>
                      <Column field="name" header="Name"></Column>
                      <Column field="points" header="Punkte" style="width: 100px">
                        <template #body="slotProps">
                          <span v-if="slotProps.data.points" class="points-badge">
                            {{ slotProps.data.points }}
                          </span>
                        </template>
                      </Column>
                    </DataTable>
                  </template>
                </Card>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- Runde 3 -->
          <AccordionPanel value="2">
            <AccordionHeader>Qualifikationsrunde 3</AccordionHeader>
            <AccordionContent>
              <Message severity="info" :closable="false"> Keine Heats vorhanden </Message>
            </AccordionContent>
          </AccordionPanel>

          <!-- Finale -->
          <AccordionPanel value="3">
            <AccordionHeader>Finale</AccordionHeader>
            <AccordionContent>
              <Message severity="info" :closable="false"> Keine Heats vorhanden </Message>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Message from 'primevue/message'
import Tag from 'primevue/tag'

const activeIndex = ref<string[] | undefined>(['1']) // Open round 2 by default

interface Participant {
  pos: number
  name: string
  points?: number
}

interface Heat {
  id: number
  status: string
  participants: Participant[]
}

const heatsRound2: Heat[] = [
  {
    id: 7,
    status: 'Abgeschlossen',
    participants: [
      { pos: 1, name: 'Lisa Schmidt', points: 87 },
      { pos: 2, name: 'Tom Weber', points: 92 },
      { pos: 3, name: 'Emma Fischer', points: 95 },
    ],
  },
  {
    id: 8,
    status: 'Live',
    participants: [
      { pos: 1, name: 'Sarah Müller' },
      { pos: 2, name: 'Jonas Wagner' },
    ],
  },
]

const getStatusSeverity = (status: string): 'success' | 'warn' | 'info' | 'danger' => {
  switch (status) {
    case 'Abgeschlossen':
      return 'success'
    case 'Live':
      return 'warn'
    case 'Anstehend':
      return 'info'
    default:
      return 'info'
  }
}
</script>

<style scoped>
.tournament-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: Arial, sans-serif;
}

.heat-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
}

.heats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.heat-card {
  height: 100%;
}

.points-badge {
  font-weight: bold;
  color: #4a90e2;
}

@media (max-width: 768px) {
  .tournament-container {
    margin: 1rem auto;
  }

  .heats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
