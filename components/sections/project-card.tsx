import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={{ pathname: `/work/${project.slug}` }} className="group block">
      <Card className="h-full transition-colors group-hover:border-accent/60">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            {project.status !== "active" ? (
              <Badge variant="outline" className="capitalize">
                {project.status}
              </Badge>
            ) : null}
          </div>
          {project.summary ? (
            <CardDescription>{project.summary}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {(project.tech_stack ?? []).slice(0, 5).map((t) => (
              <Badge key={t} variant="accent">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
