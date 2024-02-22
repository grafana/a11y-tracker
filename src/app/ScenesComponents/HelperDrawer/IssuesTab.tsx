import React from 'react';
import { IssueCard } from 'app/components/IssueCard';
import { Issue } from 'app/models/issue';

type IssuesTabProps = {
  issues: Issue[];
};

export const IssuesTab = ({ issues }: IssuesTabProps) => {
  return (
    <div>
      {issues?.map((issue, i) => {
        return <IssueCard key={i} issue={issue} />;
      })}
    </div>
  );
};
